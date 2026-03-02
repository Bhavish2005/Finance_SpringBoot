// import { Link } from 'react-router-dom'

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700">

//       {/* Navbar */}
//       <nav className="flex items-center justify-between px-8 py-5">
//         <div className="flex items-center gap-2">
//           <span className="text-2xl">💰</span>
//           <span className="text-white font-bold text-xl">PocketTrack</span>
//         </div>
//         <div className="flex items-center gap-3">
//           <Link
//             to="/login"
//             className="text-white/80 hover:text-white text-sm font-medium transition-colors"
//           >
//             Sign In
//           </Link>
//           <Link
//             to="/register"
//             className="bg-white text-blue-600 hover:bg-blue-50 text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
//           >
//             Get Started
//           </Link>
//         </div>
//       </nav>

//       {/* Hero */}
//       <div className="text-center px-6 pt-20 pb-16">
//         <div className="inline-block bg-white/10 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
//           🚀 AI-Powered Finance Tracker
//         </div>
//         <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
//           Take Control of<br />Your Finances
//         </h1>
//         <p className="text-blue-100 text-lg max-w-md mx-auto mb-10">
//           Track expenses, set budgets, achieve goals — and let AI scan your receipts automatically.
//         </p>
//         <Link
//           to="/register"
//           className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-3.5 rounded-2xl text-base transition-colors inline-block"
//         >
//           Start for Free →
//         </Link>
//       </div>

//       {/* Feature Cards */}
//       <div className="max-w-4xl mx-auto px-6 pb-20">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {[
//             { icon: '🤖', title: 'AI Receipt Scanner',    desc: 'Snap a photo — AI extracts merchant, amount and category instantly' },
//             { icon: '📊', title: 'Smart Dashboard',       desc: 'Charts and insights show exactly where your money goes each month' },
//             { icon: '🎯', title: 'Budget & Goals',        desc: 'Set spending limits and savings goals — get alerts before overspending' },
//           ].map(({ icon, title, desc }) => (
//             <div key={title} className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
//               <span className="text-3xl block mb-3">{icon}</span>
//               <h3 className="font-bold text-lg mb-2">{title}</h3>
//               <p className="text-blue-100 text-sm leading-relaxed">{desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }



import { Link } from 'react-router-dom'
import {
  MdAccountBalance, MdDocumentScanner, MdTrackChanges,
  MdStar, MdFavorite, MdTrendingUp, MdSecurity,
  MdSpeed, MdSmartphone, MdCheck, MdArrowForward,
  MdEmail, MdPhone, MdLocationOn
} from 'react-icons/md'
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa'

const features = [
  {
    icon: MdDocumentScanner,
    title: 'AI Receipt Scanner',
    desc: 'Snap a photo of any receipt — our Gemini AI instantly extracts merchant, amount, date and category. No manual entry needed.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: MdTrendingUp,
    title: 'Smart Dashboard',
    desc: 'Beautiful charts and insights show exactly where your money goes. Track income vs expenses across 6 months at a glance.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: MdTrackChanges,
    title: 'Budget Management',
    desc: 'Set monthly spending limits per category. Get instant email alerts at 80% and 100% — before it\'s too late.',
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    icon: MdStar,
    title: 'Savings Goals',
    desc: 'Define what you\'re saving for. Track progress with visual goal cards and celebrate when you hit your target.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: MdFavorite,
    title: 'Financial Health Score',
    desc: 'Get a 0-100 score based on your savings rate, budget adherence, goal progress and net worth. Know exactly where you stand.',
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: MdAccountBalance,
    title: 'Multi-Account Support',
    desc: 'Manage savings, checking, credit cards and investments in one place. Real-time balance updates on every transaction.',
    color: 'bg-indigo-100 text-indigo-600',
  },
]

const comparisons = [
  { feature: 'AI Receipt Scanning',       us: true,  others: false },
  { feature: 'Financial Health Score',    us: true,  others: false },
  { feature: 'Budget Email Alerts',       us: true,  others: false },
  { feature: 'Monthly Email Reports',     us: true,  others: false },
  { feature: 'Multi-Account Tracking',    us: true,  others: true  },
  { feature: 'Goal Tracking',             us: true,  others: true  },
  { feature: 'CSV Export',                us: true,  others: true  },
  { feature: 'Free to Use',              us: true,  others: false },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer, Bangalore',
    avatar: 'PS',
    text: 'PocketTrack changed how I manage money. The AI receipt scanner saves me 30 minutes every week. The health score keeps me motivated to save more.',
    rating: 5,
  },
  {
    name: 'Rahul Mehta',
    role: 'MBA Student, Mumbai',
    avatar: 'RM',
    text: 'Finally a finance app that actually explains where my money goes. The budget alerts stopped me from overspending three times last month alone.',
    rating: 5,
  },
  {
    name: 'Ananya Krishnan',
    role: 'Freelance Designer, Chennai',
    avatar: 'AK',
    text: 'As a freelancer with variable income, PocketTrack\'s multi-account tracking and monthly reports are invaluable. The monthly email is my financial report card.',
    rating: 5,
  },
]

const stats = [
  { value: '50K+', label: 'Transactions Tracked' },
  { value: '10K+', label: 'Active Users' },
  { value: '₹2Cr+', label: 'Money Managed' },
  { value: '4.9★', label: 'User Rating' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MdAccountBalance className="text-white text-lg" />
            </div>
            <span className="font-bold text-gray-900 text-lg">PocketTrack</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features"     className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#compare"      className="hover:text-blue-600 transition-colors">Compare</a>
            <a href="#testimonials" className="hover:text-blue-600 transition-colors">Reviews</a>
            <a href="#contact"      className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">
              Sign In
            </Link>
            <Link to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <MdSpeed className="text-base" />
            AI-Powered Personal Finance
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Take Control of Your
            <span className="text-blue-600"> Finances</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Track expenses, scan receipts with AI, set smart budgets and achieve
            your savings goals — all in one beautiful app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl text-base transition-colors">
              Start for Free
              <MdArrowForward className="text-lg" />
            </Link>
            <a href="#features"
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-8 py-4 rounded-2xl text-base transition-colors">
              See Features
            </a>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            No credit card required · Free forever
          </p>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                <p className="text-3xl font-bold text-blue-600">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to
              <span className="text-blue-600"> Master Money</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              From AI-powered receipt scanning to financial health scoring —
              PocketTrack has every tool you need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="text-2xl" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us / Compare */}
      <section id="compare" className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose
              <span className="text-blue-600"> PocketTrack?</span>
            </h2>
            <p className="text-gray-500 text-lg">
              See how we compare to other finance apps
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
              <div className="px-6 py-4 text-sm font-semibold text-gray-500">Feature</div>
              <div className="px-6 py-4 text-sm font-bold text-blue-600 text-center border-x border-gray-200 bg-blue-50">
                PocketTrack
              </div>
              <div className="px-6 py-4 text-sm font-semibold text-gray-500 text-center">
                Others
              </div>
            </div>

            {/* Rows */}
            {comparisons.map(({ feature, us, others }, i) => (
              <div
                key={feature}
                className={`grid grid-cols-3 border-b border-gray-100 last:border-0
                  ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
              >
                <div className="px-6 py-4 text-sm text-gray-700 font-medium">
                  {feature}
                </div>
                <div className="px-6 py-4 flex justify-center border-x border-gray-200 bg-blue-50/30">
                  {us
                    ? <MdCheck className="text-green-500 text-xl" />
                    : <span className="text-gray-300 text-xl">✕</span>
                  }
                </div>
                <div className="px-6 py-4 flex justify-center">
                  {others
                    ? <MdCheck className="text-green-500 text-xl" />
                    : <span className="text-gray-300 text-xl">✕</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users
              <span className="text-blue-600"> Say</span>
            </h2>
            <p className="text-gray-500 text-lg">
              Thousands of people trust PocketTrack with their finances
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, avatar, text, rating }) => (
              <div key={name}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(rating)].map((_, i) => (
                    <MdStar key={i} className="text-yellow-400 text-lg" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  "{text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                    {avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{name}</p>
                    <p className="text-xs text-gray-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-20 px-6 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">About PocketTrack</h2>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            PocketTrack was built by developers who were frustrated with
            complicated finance apps. We believe everyone deserves simple,
            powerful tools to understand and control their money.
            Our mission is to make financial clarity accessible to everyone.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              { icon: MdSecurity, title: 'Bank-Level Security', desc: 'Your data is encrypted and never shared with third parties' },
              { icon: MdSmartphone, title: 'Works Everywhere', desc: 'Access from any device — desktop, tablet or mobile browser' },
              { icon: MdSpeed,     title: 'Lightning Fast',    desc: 'Built with modern tech for instant responses every time' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <Icon className="text-3xl text-white mb-3 mx-auto" />
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-blue-100 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Take Control?
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Join thousands of people already managing their finances smarter
            with PocketTrack.
          </p>
          <Link to="/register"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-colors">
            Get Started — It's Free
            <MdArrowForward className="text-xl" />
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Contact <span className="text-blue-600">Us</span>
            </h2>
            <p className="text-gray-500 text-lg">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: MdEmail,       title: 'Email',    value: 'support@pockettrack.in' },
              { icon: MdPhone,       title: 'Phone',    value: '+91 98765 43210' },
              { icon: MdLocationOn,  title: 'Location', value: 'Chandigarh, India' },
            ].map(({ icon: Icon, title, value }) => (
              <div key={title}
                className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-blue-600 text-2xl" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">{title}</p>
                <p className="text-gray-500 text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Your Name"
                className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <textarea
              rows={4}
              placeholder="Your message..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none"
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MdAccountBalance className="text-white text-lg" />
                </div>
                <span className="font-bold text-lg">PocketTrack</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your AI-powered personal finance manager. Track, save, and grow.
              </p>
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <FaTwitter className="text-sm" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <FaGithub className="text-sm" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <FaLinkedin className="text-sm" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <p className="font-semibold mb-4 text-white">Product</p>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#features"     className="block hover:text-white transition-colors">Features</a>
                <a href="#compare"      className="block hover:text-white transition-colors">Compare</a>
                <a href="#testimonials" className="block hover:text-white transition-colors">Reviews</a>
                <Link to="/register"    className="block hover:text-white transition-colors">Get Started</Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <p className="font-semibold mb-4 text-white">Company</p>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#about"   className="block hover:text-white transition-colors">About Us</a>
                <a href="#contact" className="block hover:text-white transition-colors">Contact</a>
                <a href="#"        className="block hover:text-white transition-colors">Privacy Policy</a>
                <a href="#"        className="block hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <p className="font-semibold mb-4 text-white">Stay Updated</p>
              <p className="text-gray-400 text-sm mb-3">
                Get financial tips and product updates.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 PocketTrack. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Made with ❤️ in India
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}