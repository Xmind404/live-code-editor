function run() {
    const html = document.getElementById("html-code").value;
    const css = document.getElementById("css-code").value;
    const js = document.getElementById("js-code").value;
    const output = document.getElementById("output");
    output.contentDocument.open();
    output.contentDocument.write(html + "<style>" + css + "</style>");
    output.contentDocument.close();
    try { output.contentWindow.eval(js); } catch(e){console.error(e);}
}

function saveToLocal() {
    localStorage.setItem("live_html", document.getElementById("html-code").value);
    localStorage.setItem("live_css", document.getElementById("css-code").value);
    localStorage.setItem("live_js", document.getElementById("js-code").value);
}

function loadFromLocal() {
    document.getElementById("html-code").value = localStorage.getItem("live_html") || "";
    document.getElementById("css-code").value = localStorage.getItem("live_css") || "";
    document.getElementById("js-code").value = localStorage.getItem("live_js") || "";
}

function indentSelection(textarea, remove) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const beforeStart = value.lastIndexOf("\n", start-1)+1;
    const afterEnd = value.indexOf("\n", end);
    const selectionEnd = afterEnd===-1? value.length : afterEnd;
    const before = value.slice(0,beforeStart);
    const selected = value.slice(beforeStart,selectionEnd);
    const after = value.slice(selectionEnd);
    const lines = selected.split("\n");
    const updated = lines.map(l=>remove?l.replace(/^(?: {1,4}|\t)/,""):"    "+l).join("\n");
    textarea.value = before+updated+after;
    textarea.selectionStart = start+(remove?-countRemovedSpaces(lines):4);
    textarea.selectionEnd = end+(remove?-countRemovedSpaces(lines):4*lines.length);
    function countRemovedSpaces(arr){return arr.reduce((a,l)=>a+(l.match(/^(?: {1,4}|\t)/)?l.match(/^(?: {1,4}|\t)/)[0].length:0),0);}
}

document.addEventListener("keydown",e=>{
    const isMac = navigator.platform.toUpperCase().includes("MAC");
    const ctrl = isMac ? e.metaKey : e.ctrlKey;
    if(ctrl && e.key==="Enter"){run(); e.preventDefault();}
    if(ctrl && e.key.toLowerCase()==="s"){saveToLocal(); e.preventDefault();}
    if(e.key==="Tab"){
        const a=document.activeElement;
        if(a.tagName==="TEXTAREA"){indentSelection(a,e.shiftKey); e.preventDefault();}
    }
});

function copyCode(id){
    const textarea = document.getElementById(id);
    textarea.select();
    navigator.clipboard.writeText(textarea.value);
}

window.addEventListener("DOMContentLoaded",()=>{loadFromLocal(); run();});