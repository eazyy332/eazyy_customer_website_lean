import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import EazyyIcon from "@/components/EazyyIcon";

export default function Privacy() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine which page content to show based on the current path
  const getPageContent = () => {
    switch (currentPath) {
      case '/website-terms':
        return {
          title: 'Website Terms of Use',
          description: 'Terms and conditions for using the eazyy website and services',
          content: <WebsiteTermsContent />
        };
      case '/legal-agreements':
        return {
          title: 'Legal Agreements',
          description: 'Legal agreements and policies governing our services',
          content: <LegalAgreementsContent />
        };
      case '/modern-slavery-policy':
        return {
          title: 'Modern Slavery Policy',
          description: 'Our commitment to preventing modern slavery in our operations',
          content: <ModernSlaveryPolicyContent />
        };
      case '/terms':
        return {
          title: 'Terms of Service',
          description: 'Terms and conditions for using eazyy services',
          content: <TermsOfServiceContent />
        };
      default:
        return {
          title: 'Privacy Policy',
          description: 'How we collect, use, and protect your personal information',
          content: <PrivacyPolicyContent />
        };
    }
  };

  const { title, description, content } = getPageContent();

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{title} | eazyy</title>
        <meta name="description" content={description} />
      </Helmet>

      {/* Hero Section */}
      <section className="px-4 lg:px-16 py-12 lg:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-accent rounded-lg mb-6">
            <EazyyIcon className="w-5 h-6 mr-3 text-primary" />
            <span className="text-primary font-medium">Legal Information</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-medium text-black mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 lg:px-16 py-20">
        <div className="max-w-4xl mx-auto">
          {content}
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 lg:px-16 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-medium text-black mb-6">Questions About Our Policies?</h2>
          <p className="text-xl text-gray-600 mb-8">
            If you have any questions about our legal policies or need clarification, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-block bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Contact Legal Team
            </Link>
            <Link
              to="/help"
              className="inline-block border border-gray-300 text-black px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Visit Help Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PrivacyPolicyContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Last Updated: January 1, 2025</h3>
        <p className="text-blue-800">
          This Privacy Policy explains how eazyy collects, uses, and protects your personal information when you use our laundry services.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Information We Collect</h2>
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-black mb-3">Personal Information</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Name, email address, and phone number</li>
          <li>• Pickup and delivery addresses</li>
          <li>• Payment information (processed securely by our payment partners)</li>
          <li>• Order history and service preferences</li>
        </ul>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-black mb-3">Automatically Collected Information</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Device information and IP address</li>
          <li>• Usage data and website interactions</li>
          <li>• Location data (with your permission) for delivery services</li>
          <li>• Cookies and similar tracking technologies</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">How We Use Your Information</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-3">Service Delivery</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Process and fulfill your orders</li>
            <li>• Schedule pickups and deliveries</li>
            <li>• Communicate order status updates</li>
            <li>• Provide customer support</li>
          </ul>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-3">Business Operations</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Improve our services and website</li>
            <li>• Analyze usage patterns and preferences</li>
            <li>• Prevent fraud and ensure security</li>
            <li>• Comply with legal obligations</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Information Sharing</h2>
      <p className="text-gray-700 mb-4">
        We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
      </p>
      <ul className="space-y-3 text-gray-700 mb-6">
        <li className="flex items-start">
          <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
          <span><strong>Service Providers:</strong> Trusted partners who help us deliver services (payment processors, delivery partners)</span>
        </li>
        <li className="flex items-start">
          <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
          <span><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</span>
        </li>
        <li className="flex items-start">
          <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
          <span><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</span>
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Data Security</h2>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <p className="text-green-800">
          We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Your Rights</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-black mb-2">Access & Correction</h3>
          <p className="text-sm text-gray-700">Request access to or correction of your personal data</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-black mb-2">Data Portability</h3>
          <p className="text-sm text-gray-700">Request a copy of your data in a portable format</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-black mb-2">Deletion</h3>
          <p className="text-sm text-gray-700">Request deletion of your personal information</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-black mb-2">Opt-out</h3>
          <p className="text-sm text-gray-700">Unsubscribe from marketing communications</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Contact Information</h2>
      <div className="bg-gray-50 rounded-lg p-6">
        <p className="text-gray-700 mb-4">
          For privacy-related questions or to exercise your rights, contact our Data Protection Officer:
        </p>
        <div className="space-y-2 text-gray-700">
          <p><strong>Email:</strong> privacy@eazyy.com</p>
          <p><strong>Address:</strong> eazyy Privacy Team, 123 Clean Street, Amsterdam, Netherlands</p>
          <p><strong>Phone:</strong> +31 20 123 4567</p>
        </div>
      </div>
    </div>
  );
}

function WebsiteTermsContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Effective Date: January 1, 2025</h3>
        <p className="text-blue-800">
          These Website Terms of Use govern your access to and use of the eazyy website and mobile applications.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Acceptance of Terms</h2>
      <p className="text-gray-700 mb-6">
        By accessing or using our website, mobile app, or services, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our services.
      </p>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Website Usage</h2>
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-black mb-3">Permitted Uses</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Browse and learn about our laundry services</li>
          <li>• Create an account and place orders</li>
          <li>• Track your orders and communicate with our team</li>
          <li>• Access customer support and help resources</li>
        </ul>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-red-900 mb-3">Prohibited Uses</h3>
        <ul className="space-y-2 text-red-800">
          <li>• Use the website for any unlawful purpose</li>
          <li>• Attempt to gain unauthorized access to our systems</li>
          <li>• Upload malicious code or interfere with website functionality</li>
          <li>• Impersonate others or provide false information</li>
          <li>• Use automated systems to access the website without permission</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Account Responsibilities</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-3">Account Security</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Keep your login credentials secure</li>
            <li>• Notify us immediately of unauthorized access</li>
            <li>• Use strong, unique passwords</li>
            <li>• Log out from shared devices</li>
          </ul>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-3">Accurate Information</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Provide accurate contact information</li>
            <li>• Update your profile when details change</li>
            <li>• Ensure delivery addresses are correct</li>
            <li>• Report any billing discrepancies promptly</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Intellectual Property</h2>
      <p className="text-gray-700 mb-4">
        All content on this website, including text, graphics, logos, images, and software, is the property of eazyy or its licensors and is protected by copyright and other intellectual property laws.
      </p>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Limitation of Liability</h2>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <p className="text-yellow-800">
          eazyy shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or services, except as required by applicable law.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Changes to Terms</h2>
      <p className="text-gray-700 mb-6">
        We may update these terms from time to time. We will notify you of any material changes by posting the new terms on our website and updating the effective date.
      </p>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-black mb-3">Contact Us</h3>
        <p className="text-gray-700 mb-4">
          If you have questions about these Website Terms of Use, please contact us:
        </p>
        <div className="space-y-2 text-gray-700">
          <p><strong>Email:</strong> legal@eazyy.com</p>
          <p><strong>Address:</strong> eazyy Legal Department, 123 Clean Street, Amsterdam, Netherlands</p>
          <p><strong>Phone:</strong> +31 20 123 4567</p>
        </div>
      </div>
    </div>
  );
}

function LegalAgreementsContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Legal Framework</h3>
        <p className="text-blue-800">
          This page outlines the key legal agreements that govern your relationship with eazyy and our laundry services.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Service Agreement</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-black mb-3">Scope of Services</h3>
        <p className="text-gray-700 mb-4">
          eazyy provides professional laundry and dry cleaning services including pickup, cleaning, and delivery of garments and household items.
        </p>
        <ul className="space-y-2 text-gray-700">
          <li>• Wash and fold services for everyday clothing</li>
          <li>• Professional dry cleaning for delicate items</li>
          <li>• Specialty cleaning for unique or valuable items</li>
          <li>• Minor repairs and alterations (where available)</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Customer Responsibilities</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-3">Item Preparation</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Empty all pockets before pickup</li>
            <li>• Separate delicate items as instructed</li>
            <li>• Inform us of any stains or damage</li>
            <li>• Provide special care instructions</li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-3">Access & Availability</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Be available during scheduled pickup times</li>
            <li>• Provide clear access instructions</li>
            <li>• Ensure safe pickup/delivery locations</li>
            <li>• Notify us of any schedule changes</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Liability and Insurance</h2>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-green-900 mb-3">Our Guarantee</h3>
        <p className="text-green-800 mb-3">
          We stand behind our work with comprehensive coverage for your items:
        </p>
        <ul className="space-y-2 text-green-800">
          <li>• 100% satisfaction guarantee on all services</li>
          <li>• Full insurance coverage for lost or damaged items</li>
          <li>• Free re-cleaning if you're not satisfied</li>
          <li>• Transparent claims process for any issues</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Payment Terms</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-black mb-3">Billing and Payment</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Payment is due upon completion of services</li>
          <li>• We accept major credit cards, debit cards, and digital payments</li>
          <li>• Automatic billing for subscription customers</li>
          <li>• Refunds processed within 5-7 business days</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Dispute Resolution</h2>
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-black mb-3">Resolution Process</h3>
        <ol className="space-y-2 text-gray-700">
          <li>1. <strong>Direct Contact:</strong> Contact our customer service team first</li>
          <li>2. <strong>Formal Complaint:</strong> Submit a written complaint if unresolved</li>
          <li>3. <strong>Mediation:</strong> Participate in mediation if necessary</li>
          <li>4. <strong>Arbitration:</strong> Binding arbitration as a last resort</li>
        </ol>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-black mb-3">Legal Contact</h3>
        <p className="text-gray-700 mb-4">
          For legal matters or formal disputes, please contact:
        </p>
        <div className="space-y-2 text-gray-700">
          <p><strong>Email:</strong> legal@eazyy.com</p>
          <p><strong>Address:</strong> eazyy Legal Department, 123 Clean Street, Amsterdam, Netherlands</p>
          <p><strong>Phone:</strong> +31 20 123 4567</p>
        </div>
      </div>
    </div>
  );
}

function ModernSlaveryPolicyContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Our Commitment</h3>
        <p className="text-blue-800">
          eazyy is committed to preventing modern slavery and human trafficking in all forms within our business operations and supply chain.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Policy Statement</h2>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <p className="text-green-800 text-lg leading-relaxed">
          We have zero tolerance for modern slavery, human trafficking, forced labor, and child labor. We are committed to ensuring that our business and supply chains are free from these practices.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Our Business Structure</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-black mb-3">Direct Operations</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• All employees are directly hired with proper employment contracts</li>
          <li>• Regular audits of working conditions and employee welfare</li>
          <li>• Fair wages and benefits above industry standards</li>
          <li>• Safe working environments with proper training</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Supply Chain Management</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-3">Supplier Standards</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Mandatory supplier code of conduct</li>
            <li>• Regular supplier audits and assessments</li>
            <li>• Verification of employment practices</li>
            <li>• Immediate termination for violations</li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-3">Due Diligence</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Background checks on all partners</li>
            <li>• Site visits and inspections</li>
            <li>• Employee interview processes</li>
            <li>• Documentation verification</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Risk Assessment</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-black mb-3">High-Risk Areas</h3>
        <p className="text-gray-700 mb-4">We have identified and actively monitor these potential risk areas:</p>
        <ul className="space-y-2 text-gray-700">
          <li>• Cleaning chemical suppliers and manufacturers</li>
          <li>• Textile and garment care product suppliers</li>
          <li>• Transportation and logistics partners</li>
          <li>• Temporary staffing agencies</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Training and Awareness</h2>
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-black mb-3">Employee Education</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Annual training on modern slavery awareness</li>
          <li>• Clear reporting procedures for concerns</li>
          <li>• Regular updates on policy changes</li>
          <li>• Management accountability for compliance</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Reporting Mechanisms</h2>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-yellow-900 mb-3">How to Report Concerns</h3>
        <p className="text-yellow-800 mb-4">
          If you suspect modern slavery or human trafficking in our operations or supply chain:
        </p>
        <div className="space-y-3 text-yellow-800">
          <div className="flex items-start">
            <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
            <div>
              <strong>Anonymous Hotline:</strong> +31 800 SLAVERY (752-8379)
              <p className="text-sm mt-1">Available 24/7, completely confidential</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
            <div>
              <strong>Email:</strong> ethics@eazyy.com
              <p className="text-sm mt-1">Secure, encrypted communication</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
            <div>
              <strong>Online Form:</strong> eazyy.com/report-concern
              <p className="text-sm mt-1">Anonymous web-based reporting</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Annual Review</h2>
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <p className="text-gray-700 mb-4">
          We conduct annual reviews of our modern slavery prevention efforts and publish transparency reports detailing:
        </p>
        <ul className="space-y-2 text-gray-700">
          <li>• Assessment of risks in our operations and supply chain</li>
          <li>• Actions taken to address identified risks</li>
          <li>• Training provided to staff and suppliers</li>
          <li>• Effectiveness of our prevention measures</li>
        </ul>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-black mb-3">Contact Information</h3>
        <p className="text-gray-700 mb-4">
          For questions about our Modern Slavery Policy or to report concerns:
        </p>
        <div className="space-y-2 text-gray-700">
          <p><strong>Ethics Officer:</strong> ethics@eazyy.com</p>
          <p><strong>Legal Department:</strong> legal@eazyy.com</p>
          <p><strong>Address:</strong> eazyy Ethics Department, 123 Clean Street, Amsterdam, Netherlands</p>
          <p><strong>Anonymous Hotline:</strong> +31 800 SLAVERY (752-8379)</p>
        </div>
      </div>
    </div>
  );
}

function TermsOfServiceContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Service Terms</h3>
        <p className="text-blue-800">
          These Terms of Service govern your use of eazyy's laundry and dry cleaning services.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Service Delivery</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-black mb-3">Pickup and Delivery</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Standard pickup within 24-48 hours of booking</li>
          <li>• Delivery within 2-5 business days depending on service type</li>
          <li>• Real-time tracking and status updates</li>
          <li>• Contactless pickup and delivery options available</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Quality Standards</h2>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-green-900 mb-3">Our Promise</h3>
        <ul className="space-y-2 text-green-800">
          <li>• Professional cleaning using industry-best practices</li>
          <li>• Eco-friendly cleaning products and processes</li>
          <li>• Careful handling of all garments and items</li>
          <li>• Quality control checks before delivery</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Pricing and Payment</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-3">Transparent Pricing</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Clear pricing displayed before booking</li>
            <li>• No hidden fees or surprise charges</li>
            <li>• Volume discounts for regular customers</li>
            <li>• Special pricing for business accounts</li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-3">Payment Methods</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Credit and debit cards</li>
            <li>• Digital wallets (Apple Pay, Google Pay)</li>
            <li>• Bank transfers and iDEAL</li>
            <li>• Corporate billing for business customers</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Cancellation Policy</h2>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-yellow-900 mb-3">Cancellation Terms</h3>
        <ul className="space-y-2 text-yellow-800">
          <li>• Free cancellation up to 2 hours before pickup</li>
          <li>• 50% charge for cancellations within 2 hours of pickup</li>
          <li>• Full refund if we cannot complete the service</li>
          <li>• Subscription services can be paused or cancelled anytime</li>
        </ul>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-black mb-3">Customer Service</h3>
        <p className="text-gray-700 mb-4">
          Questions about our Terms of Service? We're here to help:
        </p>
        <div className="space-y-2 text-gray-700">
          <p><strong>Customer Service:</strong> hello@eazyy.com</p>
          <p><strong>Phone:</strong> 1-800-EAZZY-1 (1-800-329-9991)</p>
          <p><strong>Live Chat:</strong> Available on our website 24/7</p>
          <p><strong>Address:</strong> eazyy Customer Service, 123 Clean Street, Amsterdam, Netherlands</p>
        </div>
      </div>
    </div>
  );
}

function PrivacyPolicyContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Last Updated: January 1, 2025</h3>
        <p className="text-blue-800">
          This Privacy Policy explains how eazyy collects, uses, and protects your personal information when you use our laundry services.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Information We Collect</h2>
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-black mb-3">Personal Information</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Name, email address, and phone number</li>
          <li>• Pickup and delivery addresses</li>
          <li>• Payment information (processed securely by our payment partners)</li>
          <li>• Order history and service preferences</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">How We Use Your Information</h2>
      <p className="text-gray-700 mb-4">
        We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you about your orders and our services.
      </p>

      <h2 className="text-2xl font-semibold text-black mt-8 mb-4">Data Protection</h2>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <p className="text-green-800">
          We implement robust security measures to protect your personal information, including encryption, secure servers, and regular security audits.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-black mb-3">Contact Us</h3>
        <p className="text-gray-700 mb-4">
          For privacy-related questions or concerns:
        </p>
        <div className="space-y-2 text-gray-700">
          <p><strong>Email:</strong> privacy@eazyy.com</p>
          <p><strong>Address:</strong> eazyy Privacy Team, 123 Clean Street, Amsterdam, Netherlands</p>
          <p><strong>Phone:</strong> +31 20 123 4567</p>
        </div>
      </div>
    </div>
  );
}