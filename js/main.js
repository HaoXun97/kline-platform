document.addEventListener("DOMContentLoaded", () => {
  const text = document.querySelector(".scramble-text");
  if (!text) return;

  const originalText = text.textContent;
  const chars = "!<>-_\\/[]{}—=+*^?#_";
  // const chars = "!<>-_\\/*$#@%&";
  let isScrambling = false;

  // 預先計算並設置固定寬度
  const tempSpan = document.createElement("span");
  tempSpan.style.visibility = "hidden";
  tempSpan.style.position = "absolute";
  tempSpan.style.fontSize = "2.8rem";
  tempSpan.style.fontFamily = "Segoe UI";
  tempSpan.textContent = originalText;
  document.body.appendChild(tempSpan);
  const width = tempSpan.offsetWidth;
  document.body.removeChild(tempSpan);

  // 設置容器寬度
  text.style.width = `${width}px`;

  function scramble() {
    if (isScrambling) return;
    isScrambling = true;

    let progress = 0;
    const scrambleInterval = setInterval(() => {
      text.textContent = originalText
        .split("")
        .map((char, index) => {
          if (index < progress) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      progress += 0.5;

      if (progress >= originalText.length) {
        clearInterval(scrambleInterval);
        text.textContent = originalText;
        isScrambling = false;
      }
    }, 50);
  }

  // 初始執行
  setTimeout(scramble); // 延遲執行以確保頁面已完全載入

  // 每8秒重複執行
  setInterval(scramble, 6000);
});

// 返回頂部按鈕
const backToTop = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
