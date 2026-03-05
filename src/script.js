// Hàm lấy tham số từ URL
function getGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    
    if (name) {
        // Thay thế dấu + hoặc khoảng cách để hiển thị đẹp
        document.getElementById('guest-name').innerText = name;
    } else {
        document.getElementById('guest-name').innerText = "Quý khách";
    }
}

// Chạy hàm khi trang web tải xong
window.onload = getGuestName;