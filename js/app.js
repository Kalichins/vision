const GV = {
  get(key, fallback=null){
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value){ localStorage.setItem(key, JSON.stringify(value)); },
  clear(){
    ["city","club","zone","seats","date","time","people","package","pay","busySeatsByZone"].forEach(k=>localStorage.removeItem(k));
  }
};

function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }
function goto(page){ window.location.href = page; }
function fmtKZT(n){ return Number(n||0).toLocaleString("ru-RU") + " ₸"; }

/* footer вставка (чтобы не повторять руками) */
function injectSponsorFooter(){
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="site-footer-inner">
      <div>© ${new Date().getFullYear()} VISION • Partner brands</div>
      <div class="sponsors">
        <span class="sponsor">Logitech G</span>
        <span class="sponsor">HyperX</span>
        <span class="sponsor">Lenovo</span>
        <span class="sponsor">Razer</span>
        <span class="sponsor">SteelSeries</span>
      </div>
    </div>
  `;
  document.body.appendChild(footer);
}

function initCustomSelect(root){
  const btn = root.querySelector(".cselect-btn");
  const label = root.querySelector(".cselect-label");
  const menu = root.querySelector(".cselect-menu");
  const items = Array.from(root.querySelectorAll(".cselect-item"));
  const hidden = root.querySelector("input[type=hidden]");

  function closeAll(){
    document.querySelectorAll(".cselect.open").forEach(x => { if(x!==root) x.classList.remove("open"); });
  }

  function setValue(val, text){
    hidden.value = val;
    label.textContent = text;
    items.forEach(i => i.classList.toggle("active", i.dataset.value === val));
    root.classList.remove("open");
    root.dispatchEvent(new CustomEvent("change", { detail: { value: val } }));
  }

  btn.addEventListener("click", (e)=>{
    e.preventDefault();
    closeAll();
    root.classList.toggle("open");
  });

  items.forEach(it=>{
    it.addEventListener("click", ()=>{
      setValue(it.dataset.value, it.textContent.trim());
    });
  });

  document.addEventListener("click", (e)=>{
    if(!root.contains(e.target)) root.classList.remove("open");
  });

  // init default
  const def = hidden.value;
  if(def){
    const found = items.find(i=>i.dataset.value===def);
    if(found) setValue(def, found.textContent.trim());
  } else {
    // если есть placeholder
    const ph = root.querySelector(".cselect-label[data-placeholder]");
    if(ph) label.textContent = ph.dataset.placeholder;
  }

  return { setValue, getValue: ()=>hidden.value };
}
