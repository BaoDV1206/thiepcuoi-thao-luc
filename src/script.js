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

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Define the callback function for the observer
    const handleIntersection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the class to trigger CSS transition
                entry.target.classList.add('is-visible');
                
                // Unobserve to free up memory (Run once pattern)
                observer.unobserve(entry.target);
            }
        });
    };

    // 2. Configure observer options
    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    // 3. Initialize a Singleton IntersectionObserver
    const scrollObserver = new IntersectionObserver(handleIntersection, observerOptions);

    // 4. Query ALL elements that need animation
    // Dùng querySelectorAll để lấy cả slide-from-left và slide-from-right
    const animatedElements = document.querySelectorAll('.slide-from-left, .slide-from-right');
    
    // 5. Loop through the NodeList and observe each element
    if (animatedElements.length > 0) {
        animatedElements.forEach(element => {
            scrollObserver.observe(element);
        });
    } else {
        console.warn("No animated elements found to observe.");
    }
    
});
// Chạy hàm khi trang web tải xong
window.onload = getGuestName;

document.addEventListener("DOMContentLoaded", () => {
    
    // ... [GIỮ NGUYÊN ĐOẠN CODE IntersectionObserver CỦA BẠN Ở ĐÂY] ...

    // --- RSVP FORM SUBMISSION LOGIC ---
    const rsvpForm = document.getElementById('rsvpForm');
    const submitBtn = document.getElementById('submitBtn');
    const formFeedback = document.getElementById('formFeedback');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            // Prevent default HTML form routing
            e.preventDefault(); 

            // 1. Data Extraction
            const formData = new FormData(rsvpForm);
            const requestPayload = {
                guestName: formData.get('guestName'),
                guestMessage: formData.get('guestMessage'),
                attendanceStatus: formData.get('attendanceStatus')
            };

            // 2. UI State Management (Loading state)
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "SENDING...";
            submitBtn.disabled = true;

            try {
                // 3. API Endpoint Setup
                // DÁN CÁI URL CỦA BẠN VÀO GIỮA 2 DẤU NGOẶC KÉP NÀY:
                const macroUrl = "https://script.google.com/macros/s/AKfycbxFp-K2uhBwd1useYY0GORg-NsENtvN_hJVo6HHuOTgwUZXulQ90bJHZSi8zsc6BaKfhA/exec"; 

                // 4. Async Network Request
                const response = await fetch(macroUrl, {
                    method: 'POST',
                    headers: {
                        // Workaround to bypass CORS preflight
                        'Content-Type': 'text/plain;charset=utf-8', 
                    },
                    body: JSON.stringify(requestPayload)
                });

                // 5. Response Parsing
                const result = await response.json();

                if (result.status === "success") {
                    // Success handling
                    rsvpForm.reset(); 
                    rsvpForm.classList.add('hidden'); 
                    formFeedback.innerText = "Successfully sent! Thank you.";
                    formFeedback.classList.remove('hidden');
                } else {
                    // Server returned an error object
                    throw new Error(result.message);
                }

            } catch (error) {
                // Exception handling
                console.error("Submission Error Details:", error);
                formFeedback.innerText = "Failed to send. Please try again later.";
                formFeedback.style.color = "red";
                formFeedback.classList.remove('hidden');
            } finally {
                // 6. Memory & State Cleanup
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});