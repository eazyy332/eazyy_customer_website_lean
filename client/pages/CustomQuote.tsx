import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { EmailService } from "@/lib/emailService";

interface QuoteRequest {
  itemType: string;
  material: string;
  condition: string;
  urgency: string;
  description: string;
  images: File[];
  contactInfo: {
    email: string;
    phone: string;
  };
}

interface UploadedImage {
  file: File;
  preview: string;
}

export default function CustomQuote() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest>({
    itemType: '',
    material: '',
    condition: '',
    urgency: 'standard',
    description: '',
    images: [],
    contactInfo: {
      email: '',
      phone: ''
    }
  });
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemTypes = [
    { id: 'clothing', label: 'Clothing', description: 'Shirts, dresses, pants, etc.' },
    { id: 'outerwear', label: 'Outerwear', description: 'Coats, jackets, blazers' },
    { id: 'formal', label: 'Formal Wear', description: 'Suits, evening gowns, tuxedos' },
    { id: 'accessories', label: 'Accessories', description: 'Ties, scarves, gloves' },
    { id: 'household', label: 'Household Items', description: 'Curtains, bedding, pillows' },
    { id: 'specialty', label: 'Specialty Items', description: 'Leather, fur, vintage items' }
  ];

  const materials = [
    'Cotton', 'Wool', 'Silk', 'Linen', 'Cashmere', 'Leather', 'Suede', 
    'Fur', 'Synthetic blend', 'Delicate/Vintage', 'Unknown', 'Other'
  ];

  const conditions = [
    { id: 'stained', label: 'Stained', description: 'Has visible stains or spots' },
    { id: 'damaged', label: 'Damaged', description: 'Tears, holes, or structural damage' },
    { id: 'delicate', label: 'Delicate', description: 'Requires special care due to material or age' },
    { id: 'valuable', label: 'Valuable', description: 'High-value or sentimental item' },
    { id: 'unusual', label: 'Unusual', description: 'Uncommon item or cleaning requirement' }
  ];

  const urgencyLevels = [
    { id: 'standard', label: 'Standard (3-5 days)', price: 0, description: 'Regular turnaround time' },
    { id: 'express', label: 'Express (1-2 days)', price: 15, description: 'Faster processing for urgent needs' },
    { id: 'same_day', label: 'Same Day', price: 35, description: 'Same day service (subject to availability)' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (uploadedImages.length < 3) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImages(prev => [...prev, {
            file,
            preview: e.target?.result as string
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuoteRequest = (field: keyof QuoteRequest, value: any) => {
    setQuoteRequest(prev => ({ ...prev, [field]: value }));
  };

  const updateContactInfo = (field: keyof QuoteRequest['contactInfo'], value: string) => {
    setQuoteRequest(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value }
    }));
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return quoteRequest.itemType !== '';
      case 2:
        return uploadedImages.length > 0 && quoteRequest.description.trim() !== '';
      case 3:
        return quoteRequest.contactInfo.email !== '' && quoteRequest.contactInfo.phone !== '';
      default:
        return false;
    }
  };

  const submitQuoteRequest = async () => {
    setIsSubmitting(true);

    try {
      // 1) Upload images to Supabase Storage (best-effort)
      const imageUrls: string[] = [];
      if (uploadedImages.length > 0) {
        const uploads = uploadedImages.map(async (img, idx) => {
          const file = img.file;
          const ext = file.name.split('.').pop() || 'jpg';
          const path = `custom-quotes/${Date.now()}_${idx}.${ext}`;
          const { data: upData, error: upErr } = await supabase.storage
            .from('public-assets')
            .upload(path, file, { upsert: true, contentType: file.type });
          if (!upErr && upData) {
            const { data: pub } = supabase.storage.from('public-assets').getPublicUrl(upData.path);
            if (pub?.publicUrl) imageUrls.push(pub.publicUrl);
          }
        });
        await Promise.all(uploads);
      }

      // 2) Insert custom quote row
      const { data, error } = await supabase
        .from('custom_price_quotes')
        .insert({
          item_name: quoteRequest.itemType || 'Custom Item',
          description: `${quoteRequest.material ? `${quoteRequest.material} • ` : ''}${quoteRequest.condition ? `${quoteRequest.condition} • ` : ''}${quoteRequest.description}`.trim(),
          image_url: imageUrls.length ? imageUrls : null,
          status: 'pending',
          urgency: quoteRequest.urgency || 'standard',
          customer_email: quoteRequest.contactInfo.email || null,
          customer_name: null,
          facility_id: null,
        })
        .select('id')
        .single();

      if (error) throw error;

      // Send quote notification email
      try {
        await EmailService.sendQuoteNotification({
          email: quoteRequest.contactInfo.email,
          firstName: quoteRequest.contactInfo.email.split('@')[0], // Use email prefix as fallback
          quoteId: data.id,
          itemName: quoteRequest.itemType || 'Custom Item',
          quotedPrice: 0, // Will be updated when facility provides quote
          estimatedDays: urgencyLevels.find(l => l.id === quoteRequest.urgency)?.label.includes('1-2') ? 2 : 3,
          facilityNotes: 'Your custom quote request has been received and is being reviewed by our experts.',
          cta_url: `${window.location.origin}/quote-approval/${data.id}`
        });
        console.log('Quote notification email sent successfully');
      } catch (emailError) {
        console.error('Failed to send quote notification email:', emailError);
        // Don't fail the quote submission if email fails
      }

      if (error || !data) {
        throw new Error(error?.message || 'Failed to submit custom quote');
      }

      // 3) Navigate to confirmation
      navigate('/quote/confirmation', {
        state: {
          quoteId: data.id,
          quoteRequest,
          estimatedTime: '2-4 hours'
        }
      });
    } catch (e) {
      console.error(e);
      alert('Failed to submit your quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="hidden">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-black hover:text-primary transition-colors">Home</Link>
            <Link to="/services" className="text-black hover:text-primary transition-colors">Services</Link>
            <Link to="/about" className="text-black hover:text-primary transition-colors">About us</Link>
            <Link to="/contact" className="text-black hover:text-primary transition-colors">Contact</Link>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets%2F0ba0452a2d1340e7b84136d8ed253a1b%2Fb6e642e462f04f14827396626baf4d5e?format=webp&width=800" 
              alt="eazyy logo" 
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/help" className="text-black hover:text-primary transition-colors">Help</Link>
            <div className="text-black">EN</div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="px-4 lg:px-16 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span className={currentStep >= 1 ? 'text-primary font-medium' : ''}>Item Details</span>
              <span className={currentStep >= 2 ? 'text-primary font-medium' : ''}>Photos & Description</span>
              <span className={currentStep >= 3 ? 'text-primary font-medium' : ''}>Contact Information</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-medium text-black mb-6 leading-tight">
              Get Custom Quote
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Upload photos and details for specialized items requiring expert assessment
            </p>
          </div>

          {/* Step 1: Item Type & Material */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-lg font-medium text-black mb-6">What type of item do you need cleaned?</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {itemTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => updateQuoteRequest('itemType', type.id)}
                      className={`p-4 rounded-lg text-left transition-colors ${
                        quoteRequest.itemType === type.id
                          ? 'bg-primary text-white'
                          : 'bg-white border border-gray-200 hover:border-primary text-black'
                      }`}
                    >
                      <div className="font-medium mb-1">{type.label}</div>
                      <div className={`text-sm ${
                        quoteRequest.itemType === type.id ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        {type.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-lg font-medium text-black mb-6">What material is it made from?</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {materials.map(material => (
                    <button
                      key={material}
                      onClick={() => updateQuoteRequest('material', material)}
                      className={`p-3 rounded-lg text-sm transition-colors ${
                        quoteRequest.material === material
                          ? 'bg-primary text-white'
                          : 'bg-white border border-gray-200 hover:border-primary text-black'
                      }`}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-lg font-medium text-black mb-6">What condition is the item in?</h3>
                
                <div className="space-y-3">
                  {conditions.map(condition => (
                    <button
                      key={condition.id}
                      onClick={() => updateQuoteRequest('condition', condition.id)}
                      className={`w-full p-4 rounded-lg text-left transition-colors ${
                        quoteRequest.condition === condition.id
                          ? 'bg-primary text-white'
                          : 'bg-white border border-gray-200 hover:border-primary text-black'
                      }`}
                    >
                      <div className="font-medium mb-1">{condition.label}</div>
                      <div className={`text-sm ${
                        quoteRequest.condition === condition.id ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        {condition.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Photos & Description */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-lg font-medium text-black mb-6">Upload Photos (1-3 images)</h3>
                
                {/* Image Upload Area */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image.preview} 
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  {uploadedImages.length < 3 && (
                    <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm text-gray-600">Add Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden"
                        multiple
                      />
                    </label>
                  )}
                </div>
                
                <p className="text-sm text-gray-600">
                  Upload clear photos showing the item and any stains, damage, or areas of concern.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-lg font-medium text-black mb-6">Describe the item and any concerns</h3>
                
                <textarea 
                  value={quoteRequest.description}
                  onChange={(e) => updateQuoteRequest('description', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors resize-none"
                  placeholder="Please describe:
• The specific item (brand, style, etc.)
• Any stains, damage, or special concerns
• Previous cleaning attempts
• Any special requirements or instructions
• Estimated value or sentimental importance"
                />
              </div>

              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-lg font-medium text-black mb-6">How urgent is this request?</h3>
                
                <div className="space-y-3">
                  {urgencyLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => updateQuoteRequest('urgency', level.id)}
                      className={`w-full p-4 rounded-lg text-left transition-colors ${
                        quoteRequest.urgency === level.id
                          ? 'bg-primary text-white'
                          : 'bg-white border border-gray-200 hover:border-primary text-black'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium mb-1">{level.label}</div>
                          <div className={`text-sm ${
                            quoteRequest.urgency === level.id ? 'text-white/80' : 'text-gray-600'
                          }`}>
                            {level.description}
                          </div>
                        </div>
                        {level.price > 0 && (
                          <div className={`text-sm ${
                            quoteRequest.urgency === level.id ? 'text-white' : 'text-primary'
                          }`}>
                            +€{level.price}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-lg font-medium text-black mb-6">Contact Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      value={quoteRequest.contactInfo.email}
                      onChange={(e) => updateContactInfo('email', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Phone Number *</label>
                    <input 
                      type="tel" 
                      value={quoteRequest.contactInfo.phone}
                      onChange={(e) => updateContactInfo('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                      placeholder="+31 6 12345678"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-accent rounded-2xl p-6">
                <h3 className="text-lg font-medium text-black mb-4">Quote Request Summary</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item Type</span>
                    <span className="text-black capitalize">{quoteRequest.itemType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material</span>
                    <span className="text-black">{quoteRequest.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Condition</span>
                    <span className="text-black capitalize">{quoteRequest.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Urgency</span>
                    <span className="text-black">
                      {urgencyLevels.find(l => l.id === quoteRequest.urgency)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Photos</span>
                    <span className="text-black">{uploadedImages.length} uploaded</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="font-medium text-black mb-2">What happens next?</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Our experts will review your photos and description</li>
                  <li>• You'll receive a detailed quote within 2-4 hours</li>
                  <li>• If you accept, we'll schedule pickup and delivery</li>
                  <li>• Payment is only required after you approve the quote</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12">
            {currentStep > 1 ? (
              <button 
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 border border-gray-300 rounded-full font-medium text-black hover:bg-gray-50 transition-colors"
              >
                ← Previous Step
              </button>
            ) : (
              <Link 
                to="/order/start"
                className="px-6 py-3 border border-gray-300 rounded-full font-medium text-black hover:bg-gray-50 transition-colors"
              >
                ← Back to Order Type
              </Link>
            )}
            
            {currentStep < 3 ? (
              <button 
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceedToNextStep()}
                className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Next Step →
              </button>
            ) : (
              <button 
                onClick={submitQuoteRequest}
                disabled={!canProceedToNextStep() || isSubmitting}
                className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Quote Request'
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}