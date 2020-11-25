function changeBGColor(e){
    console.log(this.style.backgroundColor);
    if (!this.style.backgroundColor) this.style.backgroundColor = "pink";
    else this.style.backgroundColor = "";
};

document.querySelector("h1").addEventListener("mouseover", changeBGColor);
document.querySelector("h1").addEventListener("mouseout", changeBGColor);