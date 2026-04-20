import { useState, useEffect } from "react";

const PRODUCTS = [
  { id:1, name:"Tanishq Gold Kundan Necklace Set", brand:"Tanishq", price:24999, mrp:31999, category:"Necklaces", material:"22K Gold", rating:4.5, reviews:2341, img:"📿", badge:"BESTSELLER", discount:22, stock:true },
  { id:2, name:"Mia Diamond Solitaire Ring", brand:"Mia by Tanishq", price:8499, mrp:11999, category:"Rings", material:"18K White Gold", rating:4.7, reviews:1892, img:"💍", badge:"TRENDING", discount:29, stock:true },
  { id:3, name:"CaratLane Pearl Drop Earrings", brand:"CaratLane", price:3299, mrp:4599, category:"Earrings", material:"Sterling Silver", rating:4.3, reviews:876, img:"💎", badge:"", discount:28, stock:true },
  { id:4, name:"Kalyan Jewellers Bangles Set", brand:"Kalyan", price:15600, mrp:18999, category:"Bracelets", material:"22K Gold", rating:4.6, reviews:3102, img:"✨", badge:"BESTSELLER", discount:18, stock:true },
  { id:5, name:"BlueStone Ruby Pendant Necklace", brand:"BlueStone", price:5699, mrp:7999, category:"Necklaces", material:"14K Gold", rating:4.4, reviews:654, img:"📿", badge:"NEW", discount:29, stock:true },
  { id:6, name:"Senco Diamond Stud Earrings", brand:"Senco", price:4199, mrp:5499, category:"Earrings", material:"18K Gold", rating:4.8, reviews:2109, img:"💎", badge:"TOP RATED", discount:24, stock:true },
  { id:7, name:"Joyalukkas Emerald Ring", brand:"Joyalukkas", price:11200, mrp:13999, category:"Rings", material:"18K Yellow Gold", rating:4.2, reviews:445, img:"💍", badge:"", discount:20, stock:false },
  { id:8, name:"PC Jeweller Tennis Bracelet", brand:"PC Jeweller", price:9899, mrp:13499, category:"Bracelets", material:"White Gold", rating:4.5, reviews:789, img:"✨", badge:"SALE", discount:27, stock:true },
];

const CATEGORIES = ["All","Necklaces","Rings","Earrings","Bracelets"];
const BANNERS = [
  { bg:"#1a237e", accent:"#e8eaf6", title:"Wedding Collection 2025", sub:"Up to 40% off on Bridal Jewellery", cta:"Shop Now", emoji:"👰" },
  { bg:"#b71c1c", accent:"#ffebee", title:"Valentine's Special", sub:"Diamonds starting ₹2,999", cta:"Explore Gifts", emoji:"💝" },
  { bg:"#1b5e20", accent:"#e8f5e9", title:"Daily Wear Essentials", sub:"Lightweight gold from ₹3,499", cta:"Browse All", emoji:"✨" },
];
const SORT_OPTIONS = ["Relevance","Price: Low to High","Price: High to Low","Avg. Customer Rating","Newest First"];
const fp = p => "₹" + p.toLocaleString("en-IN");

const Stars = ({ r, sz=12 }) => (
  <span style={{display:"inline-flex",gap:1}}>
    {[1,2,3,4,5].map(i=>(
      <span key={i} style={{fontSize:sz,color:i<=Math.floor(r)?"#f9a825":"#ccc"}}>★</span>
    ))}
  </span>
);

const RatingChip = ({ r }) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:3,background:r>=4?"#388e3c":r>=3?"#fb8c00":"#e53935",color:"#fff",fontSize:11,fontWeight:700,padding:"2px 7px",borderRadius:2}}>
    {r} ★
  </span>
);

export default function JewelleryECommerce() {
  const [tab, setTab] = useState("home");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Relevance");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selected, setSelected] = useState(null);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [maxPrice, setMaxPrice] = useState(32000);
  const [filterOpen, setFilterOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pinChecked, setPinChecked] = useState(false);
  const [size, setSize] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i+1) % BANNERS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null), 2500); };
  const addCart = p => {
    setCart(c => { const ex=c.find(i=>i.id===p.id); return ex?c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...c,{...p,qty:1}]; });
    showToast("Added to cart!");
  };
  const rmCart = id => setCart(c=>c.filter(i=>i.id!==id));
  const updQty = (id,d) => setCart(c=>c.map(i=>i.id===id?{...i,qty:Math.max(1,i.qty+d)}:i));
  const togWish = id => setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);
  const openProd = p => { setSelected(p); setSize(null); setPincode(""); setPinChecked(false); setTab("product"); };
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);
  const cartTotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const cartSaved = cart.reduce((s,i)=>s+(i.mrp-i.price)*i.qty,0);

  let filtered = PRODUCTS.filter(p=>(category==="All"||p.category===category)&&p.price<=maxPrice&&(search===""||p.name.toLowerCase().includes(search.toLowerCase())||p.brand.toLowerCase().includes(search.toLowerCase())));
  if(sort==="Price: Low to High") filtered=[...filtered].sort((a,b)=>a.price-b.price);
  else if(sort==="Price: High to Low") filtered=[...filtered].sort((a,b)=>b.price-a.price);
  else if(sort==="Avg. Customer Rating") filtered=[...filtered].sort((a,b)=>b.rating-a.rating);

  const badgeColor = b => b==="BESTSELLER"?"#ff6f00":b==="TOP RATED"?"#1565c0":b==="NEW"?"#6a1b9a":b==="TRENDING"?"#00695c":"#c62828";

  // ── STYLES ────────────────────────────────────────────────────────────────
  const css = `
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',system-ui,sans-serif}
    ::-webkit-scrollbar{width:3px;height:3px}
    ::-webkit-scrollbar-thumb{background:#2874f0;border-radius:2px}
    select,input{font-family:inherit}
    @keyframes fadeup{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
    @keyframes shimmer{0%{background-position:-200px 0}100%{background-position:200px 0}}
    .card-hover:hover{box-shadow:0 2px 12px rgba(0,0,0,0.12)}
    .btn-pri{background:#fb641b;color:#fff;border:none;border-radius:2px;font-weight:700;font-size:14px;cursor:pointer;padding:13px 0;width:100%;letter-spacing:.02em;transition:opacity .15s}
    .btn-pri:hover{opacity:.92}
    .btn-pri:disabled{opacity:.5;cursor:not-allowed}
    .btn-ghost{background:#fff;color:#2874f0;border:1.5px solid #2874f0;border-radius:2px;font-weight:700;font-size:14px;cursor:pointer;padding:13px 0;width:100%;letter-spacing:.02em}
    .btn-blue{background:#2874f0;color:#fff;border:none;border-radius:2px;font-weight:700;font-size:14px;cursor:pointer;padding:13px 0;width:100%}
    .qty-btn{width:34px;height:32px;border:none;background:#f5f5f5;font-size:18px;cursor:pointer;font-weight:700;color:#2874f0;flex-shrink:0}
    .cat-scroll{display:flex;gap:0;overflow-x:auto;scrollbar-width:none}
    .cat-scroll::-webkit-scrollbar{display:none}
    .pill{display:inline-block;font-size:9px;font-weight:700;padding:2px 7px;border-radius:2px;color:#fff;letter-spacing:.05em}
    .tag-chip{padding:7px 16px;border-radius:20px;border:1.5px solid;font-size:13px;font-weight:600;cursor:pointer;background:#fff;transition:all .15s}
    .section-hd{display:flex;align-items:center;justify-content:space-between;padding:14px 14px 10px;border-bottom:1px solid #f0f0f0}
  `;

  // ══════════════════════════════════════════════════════════════════════════
  //  HOME
  // ══════════════════════════════════════════════════════════════════════════
  const HomePage = () => (
    <div style={{paddingBottom:70}}>
      {/* Hero Banner */}
      <div style={{background:BANNERS[bannerIdx].bg,padding:"22px 16px 18px",transition:"background .6s"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{flex:1}}>
            <div style={{color:BANNERS[bannerIdx].accent,fontSize:10,fontWeight:700,letterSpacing:".12em",marginBottom:5,textTransform:"uppercase"}}>✦ Exclusive Offer</div>
            <div style={{color:"#fff",fontSize:21,fontWeight:800,lineHeight:1.2,marginBottom:5}}>{BANNERS[bannerIdx].title}</div>
            <div style={{color:BANNERS[bannerIdx].accent,fontSize:13,marginBottom:14}}>{BANNERS[bannerIdx].sub}</div>
            <button onClick={()=>{setTab("listing");setCategory("All");}} style={{background:"#fff",color:BANNERS[bannerIdx].bg,border:"none",borderRadius:2,padding:"8px 20px",fontWeight:800,fontSize:13,cursor:"pointer"}}>
              {BANNERS[bannerIdx].cta} →
            </button>
          </div>
          <div style={{fontSize:76,flexShrink:0,marginLeft:12}}>{BANNERS[bannerIdx].emoji}</div>
        </div>
        <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:14}}>
          {BANNERS.map((_,i)=>(
            <div key={i} style={{width:i===bannerIdx?22:6,height:6,borderRadius:3,background:i===bannerIdx?"#fff":"rgba(255,255,255,.35)",transition:"width .3s"}}/>
          ))}
        </div>
      </div>

      {/* Shop by Category */}
      <div style={{background:"#fff",marginBottom:8,padding:"14px 8px 14px"}}>
        <div style={{fontWeight:700,fontSize:15,padding:"0 6px 12px",color:"#212121"}}>Shop by Category</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
          {[["📿","Necklaces","#e3f2fd"],["💍","Rings","#fce4ec"],["💎","Earrings","#e8f5e9"],["✨","Bracelets","#fff8e1"]].map(([icon,label,bg])=>(
            <div key={label} onClick={()=>{setCategory(label);setTab("listing");}} style={{textAlign:"center",cursor:"pointer"}}>
              <div style={{background:bg,borderRadius:"50%",width:54,height:54,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 6px",border:"1px solid rgba(0,0,0,.06)"}}>{icon}</div>
              <div style={{fontSize:11,color:"#424242",fontWeight:600}}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Deal of the Day */}
      <div style={{background:"#fff",marginBottom:8}}>
        <div className="section-hd">
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16,fontWeight:800,color:"#212121"}}>Deal of the Day</span>
            <span style={{background:"#e53935",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:2}}>⏱ 06:42:18</span>
          </div>
          <span onClick={()=>{setTab("listing");setCategory("All");}} style={{color:"#2874f0",fontSize:12,fontWeight:700,cursor:"pointer"}}>View All</span>
        </div>
        <div style={{display:"flex",gap:10,overflowX:"auto",padding:"12px 14px 14px",scrollbarWidth:"none"}}>
          {PRODUCTS.filter(p=>p.discount>=24).map(p=>(
            <div key={p.id} onClick={()=>openProd(p)} className="card-hover" style={{flexShrink:0,width:130,cursor:"pointer",transition:"box-shadow .2s"}}>
              <div style={{background:"#f9f9f9",borderRadius:6,border:"1px solid #f0f0f0",height:112,display:"flex",alignItems:"center",justifyContent:"center",fontSize:56,marginBottom:7}}>{p.img}</div>
              <div style={{fontSize:12,fontWeight:600,color:"#212121",marginBottom:2,lineHeight:1.3}}>{p.name.split(" ").slice(0,3).join(" ")}</div>
              <div style={{fontSize:12,color:"#388e3c",fontWeight:700}}>↓{p.discount}% off</div>
              <div style={{fontSize:13,fontWeight:800,color:"#212121"}}>{fp(p.price)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div style={{background:"#fff",marginBottom:8}}>
        <div className="section-hd">
          <span style={{fontSize:15,fontWeight:800,color:"#212121"}}>Top Brands</span>
        </div>
        <div style={{display:"flex",gap:8,overflowX:"auto",padding:"10px 14px 14px",scrollbarWidth:"none"}}>
          {["Tanishq","CaratLane","BlueStone","Mia","Kalyan","Senco","Joyalukkas"].map(b=>(
            <button key={b} onClick={()=>{setSearch(b);setTab("listing");}} style={{flexShrink:0,background:"#f5f5f5",border:"1px solid #e0e0e0",borderRadius:20,padding:"7px 16px",fontSize:12,fontWeight:600,cursor:"pointer",color:"#424242",whiteSpace:"nowrap"}}>
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Grid */}
      <div style={{background:"#fff",marginBottom:8}}>
        <div className="section-hd">
          <span style={{fontSize:15,fontWeight:800,color:"#212121"}}>Trending Now 🔥</span>
          <span onClick={()=>{setTab("listing");setCategory("All");}} style={{color:"#2874f0",fontSize:12,fontWeight:700,cursor:"pointer"}}>See All</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:"#f0f0f0"}}>
          {PRODUCTS.slice(0,4).map(p=>(
            <div key={p.id} onClick={()=>openProd(p)} className="card-hover" style={{background:"#fff",cursor:"pointer",transition:"box-shadow .2s"}}>
              {p.discount>0&&<div style={{position:"relative"}}><span style={{position:"absolute",top:8,left:8,background:"#388e3c",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:2,zIndex:1}}>{p.discount}% off</span></div>}
              <div style={{background:"linear-gradient(135deg,#f9f9f9,#f0f0f0)",height:150,display:"flex",alignItems:"center",justifyContent:"center",fontSize:70,position:"relative"}}>
                {p.discount>0&&<div style={{position:"absolute",top:8,left:8,background:"#388e3c",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:2}}>{p.discount}% off</div>}
                {p.img}
              </div>
              <div style={{padding:"10px 10px 12px"}}>
                {p.badge&&<span className="pill" style={{background:badgeColor(p.badge),marginBottom:4,display:"inline-block"}}>{p.badge}</span>}
                <div style={{fontSize:11,color:"#878787",margin:"3px 0 2px"}}>{p.brand}</div>
                <div style={{fontSize:13,fontWeight:600,color:"#212121",lineHeight:1.3,marginBottom:6,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.name}</div>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:6}}>
                  <RatingChip r={p.rating}/>
                  <span style={{fontSize:10,color:"#878787"}}>({p.reviews.toLocaleString()})</span>
                </div>
                <div style={{display:"flex",alignItems:"baseline",gap:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:15,fontWeight:800,color:"#212121"}}>{fp(p.price)}</span>
                  <span style={{fontSize:11,color:"#878787",textDecoration:"line-through"}}>{fp(p.mrp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div style={{background:"#fff",marginBottom:8,padding:"14px 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:0}}>
          {[["🚚","Free Delivery","On orders ₹499+"],["🔒","100% Secure","Encrypted payments"],["↩","Easy Returns","15-day policy"]].map(([ic,t,s],i)=>(
            <div key={t} style={{textAlign:"center",padding:"8px 6px",borderRight:i<2?"1px solid #f0f0f0":"none"}}>
              <div style={{fontSize:22,marginBottom:4}}>{ic}</div>
              <div style={{fontSize:12,fontWeight:700,color:"#212121"}}>{t}</div>
              <div style={{fontSize:10,color:"#878787",marginTop:1}}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  //  LISTING
  // ══════════════════════════════════════════════════════════════════════════
  const ListingPage = () => (
    <div style={{paddingBottom:70}}>
      <div style={{background:"#fff",display:"flex",borderBottom:"1px solid #e0e0e0",position:"sticky",top:58,zIndex:50}}>
        <button onClick={()=>setFilterOpen(true)} style={{flex:1,padding:"11px 0",border:"none",borderRight:"1px solid #e0e0e0",background:"none",fontSize:13,fontWeight:700,color:"#424242",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
          <span style={{fontSize:15}}>⊞</span> Filter
        </button>
        <div style={{flex:1,position:"relative",display:"flex",alignItems:"center"}}>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{width:"100%",border:"none",fontSize:13,fontWeight:700,color:"#424242",padding:"11px 32px 11px 12px",background:"none",cursor:"pointer",appearance:"none"}}>
            {SORT_OPTIONS.map(o=><option key={o}>{o}</option>)}
          </select>
          <span style={{position:"absolute",right:12,pointerEvents:"none",color:"#424242",fontSize:11}}>▾</span>
        </div>
      </div>
      <div style={{padding:"8px 12px",fontSize:12,color:"#878787",background:"#fff",borderBottom:"1px solid #f5f5f5"}}>
        Showing <strong style={{color:"#212121"}}>{filtered.length}</strong> results {category!=="All"?`in "${category}"`:""}
      </div>
      {filtered.length===0?(
        <div style={{background:"#fff",padding:"50px 20px",textAlign:"center"}}>
          <div style={{fontSize:52,marginBottom:12}}>🔍</div>
          <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>No results found</div>
          <div style={{fontSize:13,color:"#878787"}}>Try adjusting filters or search terms</div>
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:"#e0e0e0"}}>
          {filtered.map(p=>(
            <div key={p.id} onClick={()=>openProd(p)} className="card-hover" style={{background:"#fff",cursor:"pointer",transition:"box-shadow .2s",position:"relative"}}>
              <button onClick={e=>{e.stopPropagation();togWish(p.id);}} style={{position:"absolute",top:6,right:6,background:"rgba(255,255,255,.9)",border:"1px solid #e0e0e0",borderRadius:"50%",width:30,height:30,fontSize:16,cursor:"pointer",color:wishlist.includes(p.id)?"#e53935":"#bbb",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>♥</button>
              <div style={{background:"linear-gradient(135deg,#f9f9f9,#ececec)",height:148,display:"flex",alignItems:"center",justifyContent:"center",fontSize:68,position:"relative"}}>
                {p.discount>0&&<div style={{position:"absolute",top:8,left:8,background:"#388e3c",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:2}}>{p.discount}% off</div>}
                {p.img}
              </div>
              <div style={{padding:"10px 10px 12px"}}>
                {p.badge&&<span className="pill" style={{background:badgeColor(p.badge),marginBottom:4}}>{p.badge}</span>}
                <div style={{fontSize:11,color:"#878787",margin:"3px 0 2px"}}>{p.brand}</div>
                <div style={{fontSize:13,fontWeight:600,color:"#212121",lineHeight:1.3,marginBottom:5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.name}</div>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:5}}>
                  <RatingChip r={p.rating}/>
                  <span style={{fontSize:10,color:"#878787"}}>({p.reviews.toLocaleString()})</span>
                </div>
                <div style={{display:"flex",alignItems:"baseline",gap:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:15,fontWeight:800,color:"#212121"}}>{fp(p.price)}</span>
                  <span style={{fontSize:11,color:"#878787",textDecoration:"line-through"}}>{fp(p.mrp)}</span>
                </div>
                <div style={{fontSize:11,color:"#388e3c",fontWeight:600}}>Save {fp(p.mrp-p.price)}</div>
                {!p.stock&&<div style={{fontSize:11,color:"#e53935",fontWeight:700,marginTop:3}}>Out of Stock</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter Sheet */}
      {filterOpen&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:200}} onClick={()=>setFilterOpen(false)}>
          <div onClick={e=>e.stopPropagation()} style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderRadius:"18px 18px 0 0",maxHeight:"82vh",overflow:"hidden",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"16px 16px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #e0e0e0"}}>
              <span style={{fontWeight:800,fontSize:16}}>Filters</span>
              <button onClick={()=>setFilterOpen(false)} style={{background:"none",border:"none",fontSize:24,cursor:"pointer",color:"#878787",lineHeight:1}}>×</button>
            </div>
            <div style={{overflowY:"auto",flex:1,padding:16}}>
              <div style={{marginBottom:22}}>
                <div style={{fontWeight:700,fontSize:12,color:"#878787",letterSpacing:".08em",marginBottom:12}}>CATEGORY</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {CATEGORIES.map(c=>(
                    <button key={c} className="tag-chip" onClick={()=>setCategory(c)} style={{borderColor:category===c?"#2874f0":"#e0e0e0",background:category===c?"#e8f0fe":"#fff",color:category===c?"#2874f0":"#424242"}}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:22}}>
                <div style={{fontWeight:700,fontSize:12,color:"#878787",letterSpacing:".08em",marginBottom:8}}>MAX PRICE</div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700,marginBottom:8}}>
                  <span>₹0</span><span style={{color:"#2874f0"}}>{fp(maxPrice)}</span>
                </div>
                <input type="range" min={5000} max={32000} step={500} value={maxPrice} onChange={e=>setMaxPrice(+e.target.value)} style={{width:"100%",accentColor:"#2874f0"}}/>
              </div>
              <div>
                <div style={{fontWeight:700,fontSize:12,color:"#878787",letterSpacing:".08em",marginBottom:12}}>CUSTOMER RATING</div>
                {[4,3,2].map(r=>(
                  <label key={r} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,cursor:"pointer",fontSize:13}}>
                    <input type="radio" name="rt" style={{accentColor:"#2874f0",width:16,height:16}}/>
                    <Stars r={r} sz={14}/>
                    <span style={{color:"#424242",fontWeight:600}}>{r}★ & above</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{padding:"12px 16px",borderTop:"1px solid #e0e0e0",display:"flex",gap:10}}>
              <button className="btn-ghost" onClick={()=>{setCategory("All");setMaxPrice(32000);}} style={{flex:1,padding:"12px 0"}}>Clear All</button>
              <button className="btn-blue" onClick={()=>setFilterOpen(false)} style={{flex:2,padding:"12px 0"}}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  //  PRODUCT DETAIL
  // ══════════════════════════════════════════════════════════════════════════
  const ProductPage = () => {
    const p = selected; if(!p) return null;
    return (
      <div style={{paddingBottom:80}}>
        <div style={{background:"#fff",marginBottom:8}}>
          <div style={{background:"linear-gradient(180deg,#f9f9f9,#ececec)",height:270,display:"flex",alignItems:"center",justifyContent:"center",fontSize:130,position:"relative"}}>
            {p.img}
            <button onClick={()=>togWish(p.id)} style={{position:"absolute",top:14,right:14,background:"#fff",border:"1px solid #e0e0e0",borderRadius:"50%",width:40,height:40,fontSize:22,cursor:"pointer",color:wishlist.includes(p.id)?"#e53935":"#ccc",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 4px rgba(0,0,0,.1)"}}>♥</button>
            {!p.stock&&<div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,.55)",color:"#fff",fontSize:12,fontWeight:700,padding:"4px 14px",borderRadius:2}}>Out of Stock</div>}
          </div>
          <div style={{padding:"14px 16px 16px"}}>
            {p.badge&&<span className="pill" style={{background:badgeColor(p.badge),marginBottom:8,display:"inline-block"}}>{p.badge}</span>}
            <div style={{fontSize:11,color:"#878787",marginBottom:3}}>{p.brand}</div>
            <h1 style={{fontSize:16,fontWeight:600,color:"#212121",lineHeight:1.4,marginBottom:10}}>{p.name}</h1>
            <div style={{display:"flex",alignItems:"center",gap:10,paddingBottom:12,marginBottom:12,borderBottom:"1px solid #f0f0f0"}}>
              <RatingChip r={p.rating}/>
              <span style={{fontSize:12,color:"#878787"}}>{p.reviews.toLocaleString()} Ratings & {Math.floor(p.reviews/12)} Reviews</span>
            </div>
            <div style={{background:"#e8f5e9",borderRadius:4,padding:"10px 14px",marginBottom:14}}>
              <div style={{fontSize:12,color:"#388e3c",fontWeight:700,marginBottom:6}}>Special Price</div>
              <div style={{display:"flex",alignItems:"baseline",gap:10,flexWrap:"wrap"}}>
                <span style={{fontSize:26,fontWeight:800,color:"#212121"}}>{fp(p.price)}</span>
                <span style={{fontSize:15,color:"#878787",textDecoration:"line-through"}}>{fp(p.mrp)}</span>
                <span style={{fontSize:14,color:"#388e3c",fontWeight:700}}>{p.discount}% off</span>
              </div>
              <div style={{fontSize:12,color:"#388e3c",marginTop:4,fontWeight:600}}>You save {fp(p.mrp-p.price)} 🎉</div>
            </div>
          </div>
        </div>

        {/* Size */}
        <div style={{background:"#fff",padding:"14px 16px",marginBottom:8}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Select Size <span style={{fontSize:12,color:"#2874f0",fontWeight:600,marginLeft:8,cursor:"pointer"}}>Size Guide</span></div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {["XS","S","M","L","XL","Free"].map(s=>(
              <button key={s} onClick={()=>setSize(s)} style={{width:46,height:46,borderRadius:4,border:`2px solid ${size===s?"#2874f0":"#e0e0e0"}`,background:size===s?"#e8f0fe":"#fff",color:size===s?"#2874f0":"#424242",fontWeight:700,fontSize:13,cursor:"pointer",transition:"all .15s"}}>{s}</button>
            ))}
          </div>
        </div>

        {/* Offers */}
        <div style={{background:"#fff",padding:"14px 16px",marginBottom:8}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Available Offers</div>
          {[["🏷️","Bank Offer","10% off on HDFC Bank Credit Cards"],["🎁","Special Price","Extra ₹500 off on select products"],["🚚","No Cost EMI","Available on 6, 9, 12 months"],["🔖","Partner Offer","Purchase on Easy EMI & save ₹1,500"]].map(([ic,t,d])=>(
            <div key={t} style={{display:"flex",gap:10,marginBottom:12,alignItems:"flex-start"}}>
              <span style={{fontSize:16,flexShrink:0}}>{ic}</span>
              <div style={{fontSize:13}}><span style={{fontWeight:700,color:"#388e3c"}}>{t}</span> — {d} <span style={{color:"#2874f0",fontWeight:600,cursor:"pointer"}}>T&C</span></div>
            </div>
          ))}
        </div>

        {/* Delivery */}
        <div style={{background:"#fff",padding:"14px 16px",marginBottom:8}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Delivery Options</div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <input value={pincode} onChange={e=>setPincode(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="Enter Delivery Pincode" style={{flex:1,border:"1.5px solid #e0e0e0",borderRadius:4,padding:"9px 12px",fontSize:13,outline:"none"}}/>
            <button onClick={()=>{if(pincode.length===6)setPinChecked(true);}} style={{background:"none",border:"none",color:"#2874f0",fontWeight:700,fontSize:13,cursor:"pointer",flexShrink:0,padding:"0 4px"}}>Check</button>
          </div>
          {pinChecked&&(
            <div style={{fontSize:13,color:"#388e3c",fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
              ✓ Delivery available by <strong>Tomorrow</strong> · FREE delivery
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
            {[["🔄","7 Days Returnable"],["🛡️","1 Year Warranty"],["💎","100% Authentic"],["📦","Secure Packaging"]].map(([ic,t])=>(
              <div key={t} style={{display:"flex",gap:6,alignItems:"center",fontSize:12,color:"#424242"}}>
                <span style={{fontSize:15}}>{ic}</span>{t}
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div style={{background:"#fff",padding:"14px 16px",marginBottom:8}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Product Highlights</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["Metal","Gold"],["Purity",p.material],["Weight","~5.2g"],["Certificate","BIS Hallmark"],["Finish","High Polish"],["Occasion","All Occasions"],["Closure","Lobster Clasp"],["Country","Made in India"]].map(([k,v])=>(
              <div key={k} style={{fontSize:12,display:"flex",gap:4}}>
                <span style={{color:"#878787",flexShrink:0}}>{k}:</span>
                <span style={{color:"#212121",fontWeight:600}}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Breakdown */}
        <div style={{background:"#fff",padding:"14px 16px",marginBottom:8}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>Ratings & Reviews</div>
          <div style={{display:"flex",gap:20,alignItems:"center",marginBottom:14,paddingBottom:14,borderBottom:"1px solid #f0f0f0"}}>
            <div style={{textAlign:"center",flexShrink:0}}>
              <div style={{fontSize:42,fontWeight:900,color:"#212121",lineHeight:1}}>{p.rating}</div>
              <Stars r={p.rating} sz={15}/>
              <div style={{fontSize:11,color:"#878787",marginTop:4}}>{p.reviews.toLocaleString()} ratings</div>
            </div>
            <div style={{flex:1}}>
              {[5,4,3,2,1].map(s=>{
                const pct=s===5?60:s===4?22:s===3?10:s===2?5:3;
                return(
                  <div key={s} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                    <span style={{fontSize:11,color:"#878787",width:8,flexShrink:0}}>{s}</span>
                    <span style={{fontSize:10,color:"#878787"}}>★</span>
                    <div style={{flex:1,background:"#e0e0e0",borderRadius:2,height:7,overflow:"hidden"}}>
                      <div style={{width:`${pct}%`,background:s>=4?"#388e3c":s===3?"#fb8c00":"#e53935",height:"100%",borderRadius:2,transition:"width .5s"}}/>
                    </div>
                    <span style={{fontSize:11,color:"#878787",width:24,textAlign:"right"}}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Sample Reviews */}
          {[{name:"Priya S.",rating:5,date:"2 days ago",text:"Absolutely stunning piece! The quality is exceptional and it arrived beautifully packaged."},
            {name:"Rahul M.",rating:4,date:"1 week ago",text:"Great value for money. The craftsmanship is really good, exactly as shown in the pictures."}].map(rv=>(
            <div key={rv.name} style={{marginBottom:14,paddingBottom:14,borderBottom:"1px solid #f5f5f5"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:"#2874f0",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:13}}>{rv.name[0]}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{rv.name}</div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <RatingChip r={rv.rating}/><span style={{fontSize:11,color:"#878787"}}>{rv.date}</span>
                  </div>
                </div>
              </div>
              <div style={{fontSize:13,color:"#424242",lineHeight:1.6}}>{rv.text}</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:"1px solid #e0e0e0",padding:"10px 14px",display:"flex",gap:10,zIndex:100,boxShadow:"0 -2px 8px rgba(0,0,0,.08)"}}>
          <button onClick={()=>{togWish(p.id);showToast(wishlist.includes(p.id)?"Removed from Wishlist":"Added to Wishlist!");}} className="btn-ghost" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"12px 0"}}>
            <span style={{fontSize:18}}>{wishlist.includes(p.id)?"♥":"♡"}</span> Wishlist
          </button>
          <button onClick={()=>{if(p.stock){addCart(p);}}} disabled={!p.stock} className="btn-pri" style={{flex:2}}>
            🛒 Add to Cart
          </button>
        </div>
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  CART
  // ══════════════════════════════════════════════════════════════════════════
  const CartPage = () => (
    <div style={{paddingBottom:70}}>
      {cart.length===0?(
        <div style={{background:"#fff",padding:"60px 20px",textAlign:"center"}}>
          <div style={{fontSize:64,marginBottom:16}}>🛒</div>
          <div style={{fontSize:18,fontWeight:700,marginBottom:8}}>Your cart is empty!</div>
          <div style={{fontSize:13,color:"#878787",marginBottom:24}}>Add items to it now.</div>
          <button onClick={()=>setTab("listing")} className="btn-blue" style={{width:"auto",padding:"12px 32px",display:"inline-block"}}>Shop Now</button>
        </div>
      ):(
        <>
          <div style={{background:"#e8f5e9",padding:"8px 14px",fontSize:12,color:"#388e3c",fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
            🎉 Your order is eligible for FREE Delivery
          </div>
          {cart.map(item=>(
            <div key={item.id} style={{background:"#fff",marginBottom:8,padding:"14px 16px"}}>
              <div style={{display:"flex",gap:14}}>
                <div onClick={()=>openProd(item)} style={{width:88,height:88,background:"#f5f5f5",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:50,flexShrink:0,cursor:"pointer"}}>{item.img}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,color:"#878787"}}>{item.brand}</div>
                  <div style={{fontSize:13,fontWeight:600,lineHeight:1.3,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                  <div style={{fontSize:11,color:"#878787",marginBottom:6}}>Material: {item.material}</div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:16,fontWeight:800}}>{fp(item.price)}</span>
                    <span style={{fontSize:11,textDecoration:"line-through",color:"#878787"}}>{fp(item.mrp)}</span>
                    <span style={{fontSize:11,color:"#388e3c",fontWeight:700}}>{item.discount}% off</span>
                  </div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:12,paddingTop:12,borderTop:"1px solid #f0f0f0"}}>
                <div style={{display:"flex",alignItems:"center",border:"1.5px solid #2874f0",borderRadius:4,overflow:"hidden"}}>
                  <button className="qty-btn" onClick={()=>updQty(item.id,-1)} style={{color:"#2874f0"}}>−</button>
                  <span style={{width:38,textAlign:"center",fontSize:15,fontWeight:800,color:"#212121"}}>{item.qty}</span>
                  <button className="qty-btn" onClick={()=>updQty(item.id,+1)} style={{color:"#2874f0"}}>+</button>
                </div>
                <div style={{display:"flex",gap:14}}>
                  <button onClick={()=>{togWish(item.id);rmCart(item.id);showToast("Saved to Wishlist!");}} style={{background:"none",border:"none",fontSize:13,color:"#2874f0",fontWeight:700,cursor:"pointer"}}>Save Later</button>
                  <button onClick={()=>rmCart(item.id)} style={{background:"none",border:"none",fontSize:13,color:"#878787",fontWeight:600,cursor:"pointer"}}>Remove</button>
                </div>
              </div>
            </div>
          ))}

          <div style={{background:"#fff",padding:"14px 16px",marginBottom:8}}>
            <div style={{fontWeight:700,fontSize:13,color:"#878787",letterSpacing:".07em",marginBottom:14}}>PRICE DETAILS ({cartCount} item{cartCount>1?"s":""})</div>
            {[[`Total MRP`,fp(cart.reduce((s,i)=>s+i.mrp*i.qty,0))],["Discount on MRP","−"+fp(cartSaved)],["Delivery Charges","FREE"],["Secured Packaging Fee","FREE"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:10,fontSize:14}}>
                <span style={{color:"#424242"}}>{k}</span>
                <span style={{color:k.includes("Discount")?"#388e3c":"#212121",fontWeight:k.includes("Discount")?700:400}}>{v}</span>
              </div>
            ))}
            <div style={{borderTop:"1.5px dashed #e0e0e0",paddingTop:12,marginTop:4,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontWeight:800,fontSize:16}}>Total Amount</span>
              <span style={{fontWeight:800,fontSize:16}}>{fp(cartTotal)}</span>
            </div>
            <div style={{background:"#e8f5e9",padding:"10px 14px",borderRadius:4,marginTop:12,fontSize:13,color:"#388e3c",fontWeight:700}}>
              🎉 You save {fp(cartSaved)} on this order
            </div>
          </div>

          <div style={{padding:"0 16px 16px"}}>
            <button className="btn-pri" style={{fontSize:15,padding:"14px 0",borderRadius:4}}>Place Order →</button>
          </div>
        </>
      )}
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  //  WISHLIST
  // ══════════════════════════════════════════════════════════════════════════
  const WishlistPage = () => {
    const items = PRODUCTS.filter(p=>wishlist.includes(p.id));
    return (
      <div style={{paddingBottom:70}}>
        {items.length===0?(
          <div style={{background:"#fff",padding:"60px 20px",textAlign:"center"}}>
            <div style={{fontSize:64,marginBottom:16}}>♡</div>
            <div style={{fontSize:18,fontWeight:700,marginBottom:8}}>Your Wishlist is empty</div>
            <div style={{fontSize:13,color:"#878787",marginBottom:24}}>Save your favourite items here.</div>
            <button onClick={()=>setTab("listing")} className="btn-blue" style={{width:"auto",padding:"12px 32px",display:"inline-block"}}>Explore Products</button>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:"#e0e0e0"}}>
            {items.map(p=>(
              <div key={p.id} style={{background:"#fff",position:"relative"}}>
                <button onClick={()=>togWish(p.id)} style={{position:"absolute",top:8,right:8,background:"rgba(255,255,255,.9)",border:"1px solid #e0e0e0",borderRadius:"50%",width:30,height:30,fontSize:16,cursor:"pointer",color:"#e53935",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>♥</button>
                <div onClick={()=>openProd(p)} style={{cursor:"pointer"}}>
                  <div style={{background:"#f5f5f5",height:148,display:"flex",alignItems:"center",justifyContent:"center",fontSize:68}}>{p.img}</div>
                  <div style={{padding:"10px"}}>
                    <div style={{fontSize:11,color:"#878787",marginBottom:2}}>{p.brand}</div>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:4,lineHeight:1.3,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.name}</div>
                    <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:8}}>
                      <span style={{fontSize:14,fontWeight:800}}>{fp(p.price)}</span>
                      <span style={{fontSize:11,textDecoration:"line-through",color:"#878787"}}>{fp(p.mrp)}</span>
                    </div>
                  </div>
                </div>
                <div style={{padding:"0 10px 12px"}}>
                  <button onClick={()=>{addCart(p);}} className="btn-pri" style={{padding:"9px 0",fontSize:13}}>🛒 Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const PAGE_LABELS = { home:"JewelHub", listing:category==="All"?"All Jewellery":category, product:selected?.name?.split(" ").slice(0,4).join(" ")+"…" ?? "", cart:"My Cart", wishlist:"Wishlist" };

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:"#f1f3f6",minHeight:"100vh",maxWidth:480,margin:"0 auto",position:"relative",fontSize:14,color:"#212121"}}>
      <style>{css}</style>
      {toast&&<div style={{position:"fixed",bottom:72,left:"50%",transform:"translateX(-50%)",background:"#323232",color:"#fff",padding:"10px 22px",borderRadius:4,fontSize:13,zIndex:999,whiteSpace:"nowrap",animation:"fadeup .3s ease"}}>{toast}</div>}

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{background:"#2874f0",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px 8px"}}>
          {tab!=="home"&&(
            <button onClick={()=>setTab(tab==="product"?"listing":"home")} style={{background:"none",border:"none",color:"#fff",fontSize:26,cursor:"pointer",padding:0,lineHeight:1,flexShrink:0}}>‹</button>
          )}
          {(tab==="home"||tab==="listing")?(
            <>
              <div style={{cursor:"pointer",flexShrink:0}} onClick={()=>setTab("home")}>
                <div style={{color:"#fff",fontWeight:800,fontSize:20,letterSpacing:"-0.5px",lineHeight:1}}>Jewel<span style={{color:"#ffe082"}}>Hub</span></div>
                <span style={{color:"#b3d4ff",fontSize:9,fontStyle:"italic",display:"block",marginTop:1}}>India's Finest</span>
              </div>
              <div style={{flex:1,display:"flex",alignItems:"center",background:"#fff",borderRadius:4,padding:"7px 10px",gap:6}}>
                <span style={{color:"#878787",fontSize:15,flexShrink:0}}>🔍</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>setTab("listing")} placeholder="Search jewellery, brands…" style={{border:"none",outline:"none",width:"100%",fontSize:13,color:"#333",background:"transparent"}}/>
                {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",color:"#878787",fontSize:18,padding:0,lineHeight:1,flexShrink:0}}>×</button>}
              </div>
              <button onClick={()=>setTab("wishlist")} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,fontSize:10,padding:0,flexShrink:0,position:"relative"}}>
                <span style={{fontSize:22}}>♡</span>
                {wishlist.length>0&&<span style={{position:"absolute",top:-4,right:-6,background:"#ff6161",borderRadius:"50%",width:16,height:16,fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{wishlist.length}</span>}
                <span>Wishlist</span>
              </button>
            </>
          ):(
            <div style={{flex:1,fontSize:15,fontWeight:700,color:"#fff",marginLeft:tab==="home"?0:4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{PAGE_LABELS[tab]}</div>
          )}
        </div>
        {(tab==="home"||tab==="listing")&&(
          <div className="cat-scroll" style={{background:"#2874f0",borderTop:"1px solid #3d8bf8"}}>
            {CATEGORIES.map(c=>(
              <button key={c} onClick={()=>{setCategory(c);setTab("listing");}} style={{background:"none",border:"none",color:category===c&&tab==="listing"?"#fff":"#b3d0ff",cursor:"pointer",padding:"8px 14px",fontSize:12,fontWeight:category===c&&tab==="listing"?700:400,borderBottom:category===c&&tab==="listing"?"2px solid #fff":"2px solid transparent",whiteSpace:"nowrap",flexShrink:0,transition:"all .15s"}}>{c}</button>
            ))}
          </div>
        )}
      </div>

      {/* ── PAGE ─────────────────────────────────────────────────────────── */}
      {tab==="home"&&<HomePage/>}
      {tab==="listing"&&<ListingPage/>}
      {tab==="product"&&<ProductPage/>}
      {tab==="cart"&&<CartPage/>}
      {tab==="wishlist"&&<WishlistPage/>}

      {/* ── BOTTOM NAV ─────────────────────────────────────────────────── */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:"1px solid #e0e0e0",display:"flex",zIndex:100,boxShadow:"0 -1px 4px rgba(0,0,0,.06)"}}>
        {[["🏠","Home","home"],["⊞","Shop","listing"],["🛒","Cart","cart"],["♡","Wishlist","wishlist"],["👤","Account","home"]].map(([ic,lb,t])=>(
          <button key={lb} onClick={()=>{if(t==="listing")setCategory("All");setTab(t);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"8px 0 7px",border:"none",background:"none",cursor:"pointer",color:tab===t?"#2874f0":"#878787",fontSize:10,fontWeight:tab===t?700:400,position:"relative",transition:"color .15s"}}>
            <span style={{fontSize:21,position:"relative"}}>
              {ic}
              {t==="cart"&&cartCount>0&&<span style={{position:"absolute",top:-5,right:-7,background:"#ff6161",borderRadius:"50%",width:16,height:16,fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700}}>{cartCount}</span>}
              {t==="wishlist"&&wishlist.length>0&&<span style={{position:"absolute",top:-5,right:-7,background:"#ff6161",borderRadius:"50%",width:16,height:16,fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700}}>{wishlist.length}</span>}
            </span>
            {lb}
            {tab===t&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:2,background:"#2874f0",borderRadius:2}}/>}
          </button>
        ))}
      </div>
    </div>
  );
}