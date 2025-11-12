

"use client"
import { motion } from "framer-motion"
import { TrendingUp, Mail, Phone, MapPin, Instagram, Linkedin, Twitter, Facebook, Youtube } from "lucide-react"

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Stocks", href: "/companies" },
    { name: "Watchlist", href: "/watchlist" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Contact", href: "/contact" },
      { name: "About Us", href: "/about" },
  ]

  const contactInfo = [
    { icon: Mail, text: "Swayamrachhadia@gmail.com" },
    { icon: Phone, text: "+91 9106190971" },
    { icon: MapPin, text: "LJ University Ahmedabad" },
  ]

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/stockmarket", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/stockmarket", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com/stockmarket", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com/stockmarket", label: "Facebook" },
    { icon: Youtube, href: "https://youtube.com/stockmarket", label: "YouTube" },
  ]

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-800 text-white border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-1 space-y-4"
          >
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                StockMarket
              </h3>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">
              India's premier trading platform. Real-time data, advanced tools, and expert insights to help you make informed investment decisions.
            </p>
            
            {/* Social Media Links */}
            <div className="pt-2">
              <h4 className="text-sm font-semibold text-slate-200 mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
                  >
                    <social.icon className="w-5 h-5 text-white" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <a
                    href={link.href}
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>



          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="flex items-start space-x-3 group"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
                    <info.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-slate-300 text-sm leading-tight">{info.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 pt-8 border-t border-slate-700"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} StockMarket. All rights reserved.
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Made with ❤️ for Indian investors
              </p>
            </div>
            

          </div>
          
          {/* Regulatory Information */}
          <div className="mt-4 text-center">
            <p className="text-slate-500 text-xs">
              Registered with SEBI | Member of NSE, BSE | CDSL/NSDL Depository Participant
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer