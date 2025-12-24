const btn = document.getElementById("btn");
const btnText = btn.querySelector(".btn-text");
const status = document.getElementById("status");
const popup = document.getElementById("popup");

// ===== Popup nhập key =====
const popupAlert = document.createElement("div");
popupAlert.classList.add("popup");
popupAlert.innerHTML = `
  <div class="popup-box">
    <h4>⚠ Vui Lòng Nhập Key!</h4>
    <button onclick="closeAlertPopup()">Đóng</button>
  </div>
`;
document.body.appendChild(popupAlert);
function closeAlertPopup(){ popupAlert.style.display = "none"; }

// ===== Popup key không tồn tại =====
const popupInvalid = document.createElement("div");
popupInvalid.classList.add("popup");
popupInvalid.innerHTML = `
  <div class="popup-box">
    <h4>⛌ Key Bạn Nhập Không Tồn Tại!</h4>
    <button onclick="closeInvalidPopup()">Đóng</button>
  </div>
`;
document.body.appendChild(popupInvalid);
function closeInvalidPopup(){ popupInvalid.style.display = "none"; }

// ===== Spinner VIP PRO dynamic =====
const spinner = document.createElement("div");
spinner.classList.add("spinner");
btn.appendChild(spinner);

// CSS spinner
const style = document.createElement("style");
style.innerHTML = `
.spinner{
    width:30px;
    height:30px;
    border:4px solid rgba(0,255,255,0.3);
    border-top:4px solid #0ff;
    border-radius:50%;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    display:none;
    animation:spin 1s linear infinite;
    box-shadow:0 0 10px #0ff, 0 0 20px #0ff inset;
}
@keyframes spin{
    0%{ transform:rotate(0deg) translate(-50%,-50%);}
    100%{ transform:rotate(360deg) translate(-50%,-50%);}
}
`;
document.head.appendChild(style);

// ===== Load thông tin user từ server =====
async function loadUserInfo() {
    try {
        const res = await fetch('/api/me');
        const data = await res.json();
        if(data.success){
            const user = data.user;
            document.getElementById('userName').textContent = user.ten_tai_khoan || user.email;
            document.getElementById('userBalance').textContent = (user.so_du || 0).toLocaleString() + "đ";
            status.textContent = user.kich_hoat ? "Đã Kích Hoạt" : "Chưa Kích Hoạt";
            if(user.kich_hoat) status.classList.add("active");
        }
    } catch(err){
        console.error("Lỗi load user:", err);
    }
}
loadUserInfo();

// ===== Nút Kích Hoạt =====
btn.onclick = async () => {
    const keyValue = document.getElementById("key").value.trim();

    if(!keyValue){
        popupAlert.style.display = "flex";
        return;
    }

    btnText.style.visibility = "hidden";
    spinner.style.display = "block";

    try {
        const res = await fetch('keys.json');
        const data = await res.json();
        const keys = data.keys;

        setTimeout(async () => {
            spinner.style.display = "none";
            btnText.style.visibility = "visible";

            if(keys.includes(keyValue)){
                // Key hợp lệ
                status.textContent = "Đã Kích Hoạt";
                status.classList.add("active");
                popup.style.display = "flex";

                document.getElementById("key").style.display = 'none';
                const label = document.querySelector('label');
                if(label) label.style.display = 'none';

                btnText.textContent = "Truy Cập Menu Game";
                btn.onclick = () => { window.location.href = "menugame.html"; };

                // Gửi trạng thái kích hoạt lên server
                await fetch('/api/activate', {
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({ activate:true })
                });

                // Load lại thông tin user
                loadUserInfo();

            } else {
                popupInvalid.style.display = "flex";
            }
        }, 2000);
    } catch(err){
        console.error("Lỗi load keys.json:", err);
    }
}

// ===== Sidebar Menu =====
const menuBtn = document.querySelector(".menu");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuBtn.addEventListener("click", ()=>{
    sidebar.classList.add("active");
    overlay.classList.add("active");
});
overlay.addEventListener("click", ()=>{
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});

function closePopup(){ popup.style.display="none"; }
