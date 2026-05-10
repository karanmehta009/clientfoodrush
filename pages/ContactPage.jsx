export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-20 pb-24 font-sans flex flex-col items-center selection:bg-primary/20">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center w-full">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6 drop-shadow-md">
           Get in <span className="text-primary">Touch</span>.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
           Have a question, feedback, or need help with a recent order? Our support team is available 24/7.
        </p>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] w-full text-left relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <form className="space-y-6 relative z-10" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully (Demo)!"); }}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-700 uppercase tracking-widest pl-2">Full Name</label>
                   <input required type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:bg-white focus:border-primary/50 outline-none transition-colors" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-700 uppercase tracking-widest pl-2">Email Address</label>
                   <input required type="email" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:bg-white focus:border-primary/50 outline-none transition-colors" placeholder="john@example.com" />
                </div>
             </div>
             
             <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-widest pl-2">Your Message</label>
                <textarea required rows="5" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:bg-white focus:border-primary/50 outline-none transition-colors resize-none" placeholder="How can we help you today?"></textarea>
             </div>

             <button type="submit" className="w-full py-4 bg-primary hover:bg-orange-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 active:translate-y-0 hover:-translate-y-1 transition-all duration-300">
               Send Message
             </button>
          </form>
        </div>

        <div className="mt-16 flex flex-col md:flex-row justify-center gap-10 text-gray-500 font-medium">
           <div>
             <span className="text-2xl mb-2 block">📧</span>
             support@foodrush.com
           </div>
           <div>
             <span className="text-2xl mb-2 block">📞</span>
             +1 (800) 123-4567
           </div>
           <div>
             <span className="text-2xl mb-2 block">📍</span>
             123 Culinary Ave, NY 10012
           </div>
        </div>
      </div>
    </div>
  );
}
