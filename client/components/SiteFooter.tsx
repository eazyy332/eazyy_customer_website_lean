import React from "react";
import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="px-4 md:px-8 py-16 mt-24">
      <div className="max-w-7xl mx-auto bg-[#F6F6F6] rounded-2xl p-8 md:p-12 shadow-[0_20px_60px_rgba(17,24,39,0.08)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0ba0452a2d1340e7b84136d8ed253a1b%2Fb6e642e462f04f14827396626baf4d5e?format=webp&width=320"
              alt="eazyy logo"
              className="h-8 w-auto mb-4"
            />
            <p className="text-sm text-gray-600 leading-relaxed">
              Laundry pickup and delivery in 24–48h. Eco-friendly cleaning and
              satisfaction guaranteed.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-black mb-3">Sections</h4>
            <nav className="space-y-2">
              <FooterLink to="/personal" label="Personal" />
              <FooterLink to="/business" label="Business" />
              <FooterLink to="/company" label="Company" />
            </nav>
          </div>

          <div>
            <h4 className="font-semibold text-black mb-3">Help</h4>
            <nav className="space-y-2">
              <FooterLink to="/privacy" label="Privacy" />
              <FooterLink to="/complaints" label="Complaints" />
              <FooterLink to="/cookie-policy" label="Cookie Policy" />
            </nav>
          </div>

          <div>
            <h4 className="font-semibold text-black mb-3">Company policies</h4>
            <nav className="space-y-2">
              <FooterLink to="/website-terms" label="Website terms" />
              <FooterLink to="/legal-agreements" label="Legal Agreements" />
            </nav>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} eazyy. All rights reserved.</p>
          <div className="flex gap-3">
            <Social href="https://facebook.com/eazzy" label="Facebook" svg={FacebookIcon} />
            <Social href="https://instagram.com/eazzy" label="Instagram" svg={InstagramIcon} />
            <Social href="https://tiktok.com/@eazzy" label="TikTok" svg={TiktokIcon} />
            <Social href="https://pinterest.com/eazzy" label="Pinterest" svg={PinterestIcon} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="block text-sm text-gray-700 hover:text-primary">
      {label}
    </Link>
  );
}

function Social({ href, label, svg: Svg }: { href: string; label: string; svg: () => JSX.Element }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100"
    >
      <Svg />
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.99982 0C4.0294 0 0 4.04428 0 9.03306C0 13.2692 2.90586 16.8239 6.82582 17.8002V11.7936H4.97006V9.03306H6.82582V7.84359C6.82582 4.76909 8.21216 3.34404 11.2195 3.34404C11.7898 3.34404 12.7736 3.45641 13.1761 3.56842V6.07058C12.9637 6.04818 12.5947 6.03698 12.1364 6.03698C10.6608 6.03698 10.0906 6.59811 10.0906 8.05677V9.03306H13.0303L12.5252 11.7936H10.0906V18C14.5469 17.4598 18 13.6515 18 9.03306C17.9996 4.04428 13.9702 0 8.99982 0Z"
        fill="black"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="black" strokeWidth="2"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="black" strokeWidth="2"/>
      <path d="M17.5 6.5h.01" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.0287 0H8.06913V11.5797C8.06913 12.9594 6.93087 14.0928 5.51434 14.0928C4.09781 14.0928 2.95953 12.9594 2.95953 11.5797C2.95953 10.2246 4.07251 9.11592 5.43847 9.06667V6.15943C2.42833 6.20868 0 8.59855 0 11.5797C0 14.5855 2.47892 17 5.53964 17C8.60032 17 11.0792 14.5609 11.0792 11.5797V5.64202C12.1922 6.43044 13.5582 6.89855 15 6.9232V4.01594C12.774 3.94203 11.0287 2.16811 11.0287 0Z"
        fill="black"
      />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.5 0C3.80508 0 0 4.02891 0 9C0 12.8145 2.24121 16.0699 5.40215 17.3812C5.3291 16.6676 5.25938 15.5777 5.43203 14.8008C5.58809 14.0977 6.42813 10.3289 6.42813 10.3289C6.42813 10.3289 6.17246 9.79102 6.17246 8.99297C6.17246 7.74141 6.85644 6.80625 7.70976 6.80625C8.43359 6.80625 8.78555 7.38281 8.78555 8.07539C8.78555 8.84883 8.3207 10.002 8.08164 11.0707C7.88242 11.9672 8.50664 12.6984 9.34004 12.6984C10.8508 12.6984 12.0129 11.0109 12.0129 8.57812C12.0129 6.42305 10.552 4.91484 8.46348 4.91484C6.04629 4.91484 4.6252 6.83437 4.6252 8.8207C4.6252 9.59414 4.90742 10.4238 5.25937 10.8738C5.3291 10.9617 5.33906 11.0426 5.31914 11.1305C5.25605 11.4152 5.10996 12.027 5.0834 12.15C5.04688 12.3152 4.96055 12.3504 4.79785 12.2695C3.73535 11.7457 3.07129 10.1039 3.07129 8.78203C3.07129 5.94141 5.02031 3.33633 8.68594 3.33633C11.6344 3.33633 13.9254 5.56172 13.9254 8.53594C13.9254 11.6367 12.0793 14.1328 9.51602 14.1328C8.65606 14.1328 7.8459 13.6582 7.56699 13.0992C7.56699 13.0992 7.14199 14.8184 7.03906 15.2402C6.84648 16.0207 6.32852 17.0016 5.9832 17.5992C6.78008 17.8594 7.62344 18 8.5 18C13.1949 18 17 13.9711 17 9C17 4.02891 13.1949 0 8.5 0Z"
        fill="black"
      />
    </svg>
  );
}


