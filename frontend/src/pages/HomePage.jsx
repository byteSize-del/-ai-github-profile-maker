import React from 'react';

const HomePage = () => {
    return (
        <div className="bg-surface min-h-screen text-on-surface font-sans">
            

<nav className="fixed top-0 w-full bg-[#060e20]/80 backdrop-blur-xl z-50 shadow-[0_0_20px_rgba(204,151,255,0.15)]">
<div className="flex justify-between items-center px-8 h-20 w-full max-w-7xl mx-auto font-['Space_Grotesk'] tracking-tight">
<div className="text-2xl font-bold tracking-tighter text-[#cc97ff]">Synthetic Horizon</div>
<div className="hidden md:flex gap-8 items-center">
<a className="text-[#cc97ff] border-b-2 border-[#cc97ff] pb-1 hover:bg-[#192540] transition-all duration-300" href="#">Home</a>
<a className="text-[#dee5ff]/70 hover:text-[#dee5ff] hover:bg-[#192540] transition-all duration-300" href="#">Templates</a>
<a className="text-[#dee5ff]/70 hover:text-[#dee5ff] hover:bg-[#192540] transition-all duration-300" href="#">Pricing</a>
<a className="text-[#dee5ff]/70 hover:text-[#dee5ff] hover:bg-[#192540] transition-all duration-300" href="#">Sign In</a>
<button className="cta-gradient text-on-primary px-6 py-2 rounded-lg font-bold active:scale-95 transition-transform shadow-[0_0_15px_rgba(204,151,255,0.3)]">Get Started</button>
</div>
<div className="md:hidden">
<span className="material-symbols-outlined text-primary">menu</span>
</div>
</div>
</nav>
<main className="pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-x-hidden">

<section className="grid lg:grid-cols-12 gap-16 items-center mb-32">
<div className="lg:col-span-7">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest border border-outline-variant/20 mb-6">
<div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
<span className="text-secondary text-[10px] font-bold uppercase tracking-[0.2em] font-headline">New Engine v4.0</span>
</div>
<h1 className="text-6xl md:text-8xl font-headline font-bold text-on-background tracking-tighter leading-[0.9] mb-8">
                    Craft Your <span className="text-transparent bg-clip-text cta-gradient">Developer Identity</span> with AI
                </h1>
<p className="text-xl text-on-surface-variant max-w-xl mb-12 leading-relaxed">
                    Elevate your GitHub profile from standard to standout. Our neural engine generates bespoke, high-impact READMEs that reflect your stack, stats, and professional soul.
                </p>
<div className="relative group max-w-2xl">
<div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
<div className="relative flex flex-col md:flex-row gap-4 p-2 bg-surface-container-low rounded-xl border-b-2 border-outline-variant/30 focus-within:border-primary transition-colors">
<input className="flex-grow bg-transparent border-none focus:ring-0 text-on-surface px-4 py-3 placeholder:text-on-surface-variant/50" placeholder="I'm a Full-stack dev specializing in Rust and React..." type="text"/>
<button className="cta-gradient text-on-primary px-8 py-3 rounded-lg font-bold active:scale-95 transition-transform flex items-center justify-center gap-2">
                            Generate README
                            <span className="material-symbols-outlined text-sm">auto_awesome</span>
</button>
</div>
</div>
<div className="mt-8 flex gap-6 text-on-surface-variant/60 text-sm">
<span className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">bolt</span> Instant Generation</span>
<span className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">code</span> Markdown Ready</span>
<span className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">visibility</span> Live Preview</span>
</div>
</div>
<div className="lg:col-span-5 relative">

<div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
<div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]"></div>

<div className="glass-panel border border-outline-variant/20 rounded-2xl p-6 shadow-2xl relative z-10 overflow-hidden">
<div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/10">
<div className="flex gap-2">
<div className="w-3 h-3 rounded-full bg-error/50"></div>
<div className="w-3 h-3 rounded-full bg-tertiary/50"></div>
<div className="w-3 h-3 rounded-full bg-secondary/50"></div>
</div>
<div className="text-[10px] text-on-surface-variant/40 font-mono tracking-widest">README.md</div>
</div>

<div className="space-y-6">
<div className="flex items-center gap-4">
<div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container-highest">
<img alt="User Avatar" data-alt="professional cyberpunk style developer avatar portrait with soft neon purple lighting and minimalist digital art style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-7CTUnZi6iqgwap2dx6u8aImZYy2eNVI-2je3ptafNnoirFrr2RKSKVB4QySLoMWnqQfeRIFU47VcUSUe21PO57tPJA8p37pod87ttmczWIBOVGwBBiouhoc28Xultlth0Pt1_JKyzZVxKFTyYtJxV_9U7r9T5aLzva4jFf2_zsF_J2ad4bkb1A6LwxuIipjX7zdR4jUTgiUZJqgNCAUYH6ETybuC5ssYYdXARKUr23_XAl6A0Lnf0hl3EHr1znNXiniiKlHIIjM"/>
</div>
<div>
<h3 className="text-xl font-headline font-bold text-primary">Alex Horizon</h3>
<p className="text-xs text-secondary-fixed-dim uppercase tracking-widest">Systems Architect &amp; OSS Contributor</p>
</div>
</div>
<div className="grid grid-cols-2 gap-3">
<div className="p-3 bg-surface-container-highest/50 rounded-lg border border-outline-variant/10">
<div className="text-[10px] text-on-surface-variant/60 mb-1">GitHub Streak</div>
<div className="text-lg font-headline font-bold text-on-background">342 Days</div>
</div>
<div className="p-3 bg-surface-container-highest/50 rounded-lg border border-outline-variant/10">
<div className="text-[10px] text-on-surface-variant/60 mb-1">Total PRs</div>
<div className="text-lg font-headline font-bold text-on-background">1.2k+</div>
</div>
</div>
<div className="space-y-3">
<p className="text-xs text-on-surface-variant leading-relaxed">
<span className="text-primary font-bold"># About Me</span><br/>
                                Building high-performance distributed systems in the void. Obsessed with low-latency architectures and beautiful code.
                            </p>
<div className="flex flex-wrap gap-2">
<span className="px-2 py-1 bg-surface-container-low border border-outline-variant/20 rounded text-[10px] text-secondary">Rust</span>
<span className="px-2 py-1 bg-surface-container-low border border-outline-variant/20 rounded text-[10px] text-secondary">TypeScript</span>
<span className="px-2 py-1 bg-surface-container-low border border-outline-variant/20 rounded text-[10px] text-secondary">Go</span>
<span className="px-2 py-1 bg-surface-container-low border border-outline-variant/20 rounded text-[10px] text-secondary">PostgreSQL</span>
</div>
</div>
<div className="pt-4 border-t border-outline-variant/10">
<div className="flex items-center justify-between text-[10px] text-on-surface-variant/60 mb-2">
<span>Languages</span>
<span>78% Rust</span>
</div>
<div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden flex">
<div className="h-full bg-primary w-[78%]"></div>
<div className="h-full bg-secondary w-[15%]"></div>
<div className="h-full bg-tertiary w-[7%]"></div>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="grid md:grid-cols-3 gap-6">
<div className="md:col-span-2 p-8 bg-surface-container rounded-2xl border border-outline-variant/10 flex flex-col justify-between min-h-[300px]">
<div>
<h4 className="text-2xl font-headline font-bold text-on-background mb-4">Neural Formatting</h4>
<p className="text-on-surface-variant leading-relaxed max-w-md">Our models understand the visual hierarchy of GitHub. We don't just generate text; we engineer layouts that convert profile visits into follows.</p>
</div>
<div className="flex gap-4 mt-8 overflow-hidden opacity-40">
<div className="h-32 w-24 bg-surface-container-highest rounded-lg border border-outline-variant/20"></div>
<div className="h-32 w-24 bg-surface-container-highest rounded-lg border border-outline-variant/20"></div>
<div className="h-32 w-24 bg-surface-container-highest rounded-lg border border-outline-variant/20"></div>
<div className="h-32 w-24 bg-surface-container-highest rounded-lg border border-outline-variant/20"></div>
</div>
</div>
<div className="p-8 bg-surface-container rounded-2xl border border-outline-variant/10 flex flex-col justify-between">
<div className="w-12 h-12 rounded-xl cta-gradient flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-on-primary">monitoring</span>
</div>
<div>
<h4 className="text-xl font-headline font-bold text-on-background mb-2">Dynamic Stats</h4>
<p className="text-sm text-on-surface-variant">Live-updating SVG cards that showcase your real-time contributions across the ecosystem.</p>
</div>
</div>
<div className="p-8 bg-surface-container rounded-2xl border border-outline-variant/10 flex flex-col justify-between">
<div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center mb-6 text-secondary">
<span className="material-symbols-outlined">palette</span>
</div>
<div>
<h4 className="text-xl font-headline font-bold text-on-background mb-2">Neon Accents</h4>
<p className="text-sm text-on-surface-variant">Customizable color tokens including Electric Blue and Neon Purple to match your brand.</p>
</div>
</div>
<div className="md:col-span-2 p-8 bg-surface-container rounded-2xl border border-outline-variant/10 flex items-center gap-8">
<div className="flex-1">
<h4 className="text-2xl font-headline font-bold text-on-background mb-4">OSS Native</h4>
<p className="text-on-surface-variant leading-relaxed">Built by developers for developers. Fully integrated with your public data via GitHub API for a seamless one-click experience.</p>
</div>
<div className="hidden sm:block">
<span className="material-symbols-outlined text-6xl text-on-surface-variant/20">terminal</span>
</div>
</div>
</section>
</main>

<footer className="w-full border-t border-[#192540]/30 bg-[#000000]">
<div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 w-full max-w-7xl mx-auto">
<div className="mb-8 md:mb-0">
<div className="text-lg font-black text-[#cc97ff] mb-2">Synthetic Horizon</div>
<p className="text-[#dee5ff]/50 text-xs font-['Inter'] uppercase tracking-widest">┬⌐ 2024 Synthetic Horizon. All rights reserved.</p>
</div>
<div className="flex gap-12 font-['Inter'] text-sm uppercase tracking-widest">
<a className="text-[#dee5ff]/50 hover:text-[#699cff] transition-colors opacity-80 hover:opacity-100" href="#">Twitter</a>
<a className="text-[#dee5ff]/50 hover:text-[#699cff] transition-colors opacity-80 hover:opacity-100" href="#">GitHub</a>
<a className="text-[#dee5ff]/50 hover:text-[#699cff] transition-colors opacity-80 hover:opacity-100" href="#">Discord</a>
<a className="text-[#dee5ff]/50 hover:text-[#699cff] transition-colors opacity-80 hover:opacity-100" href="#">Privacy</a>
<a className="text-[#dee5ff]/50 hover:text-[#699cff] transition-colors opacity-80 hover:opacity-100" href="#">Terms</a>
</div>
</div>
</footer>

        </div>
    );
};

export default HomePage;
