import Link from 'next/link'
import { Car, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Cartopia</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Empowering car buyers with comprehensive comparisons and unbiased information.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Compare', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-gray-600 hover:text-blue-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-600">
              <li>123 Cartopia Street</li>
              <li>Auto City, AC 12345</li>
              <li>Phone: (+40) 729 314 235</li>
              <li>Email: cruceru.andrei2202@gmail.com</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: 'https://facebook.com' },
                { icon: Twitter, href: 'https://twitter.com' },
                { icon: Instagram, href: 'https://instagram.com' },
                { icon: Linkedin, href: 'https://linkedin.com' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <social.icon className="h-6 w-6" />
                  <span className="sr-only">{social.icon.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Cartopia. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600 transition-colors mr-4">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}