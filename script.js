document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea');
    const toast = document.getElementById('toast');
    const screenReaderAnnouncement = document.getElementById('screen-reader-announcement');
    
    // Form gönderildiğinde doğrulama ve işleme
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Tüm form alanlarını doğrula
        const isValid = validateForm();
        
        if (isValid) {
            // Form başarıyla gönderildi olarak işle
            showToast('Formunuz başarıyla gönderildi!', 'success');
            announceToScreenReader('Formunuz başarıyla gönderildi!');
            
            // Formu sıfırla
            form.reset();
            
            // Tüm hata mesajlarını temizle
            clearAllErrors();
        }
    });
    
    // Her bir inputun değeri değiştiğinde doğrulama yap
    inputs.forEach(input => {
        // Blur olduğunda doğrulama yap (alan dışına çıkıldığında)
        input.addEventListener('blur', function() {
            this.classList.add('touched');
            validateInput(this);
        });
        
        // İnput değiştiğinde doğrulama yap
        input.addEventListener('input', function() {
            if (this.classList.contains('touched')) {
                validateInput(this);
            }
        });
    });
    
    // Form doğrulama fonksiyonu
    function validateForm() {
        let isValid = true;
        
        // Tüm inputları doğrula
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Tek bir input doğrulama fonksiyonu
    function validateInput(input) {
        let isValid = true;
        const errorId = input.id + 'Error';
        const errorElement = document.getElementById(errorId);
        
        // Hata mesajı yok ise hata ID'si ekle
        if (!errorElement && input.id) {
            const newErrorElement = document.createElement('div');
            newErrorElement.id = errorId;
            newErrorElement.className = 'error-message';
            newErrorElement.setAttribute('aria-live', 'polite');
            input.parentNode.appendChild(newErrorElement);
        }
        
        // İnput değerini temizle
        input.classList.remove('error');
        
        // Required kontrolü
        if (input.hasAttribute('required') && !input.value.trim()) {
            setError(input, 'Bu alan zorunludur');
            isValid = false;
        } 
        // Email formatı kontrolü
        else if (input.type === 'email' && input.value.trim() && !validateEmail(input.value)) {
            setError(input, 'Lütfen geçerli bir e-posta adresi girin');
            isValid = false;
        }
        // Radio button kontrolü (queryType için)
        else if (input.type === 'radio' && input.name === 'queryType') {
            const radioGroup = document.getElementsByName('queryType');
            let radioSelected = false;
            
            radioGroup.forEach(radio => {
                if (radio.checked) {
                    radioSelected = true;
                }
            });
            
            if (!radioSelected) {
                const errorElement = document.getElementById('queryTypeError');
                if (errorElement) {
                    errorElement.textContent = 'Lütfen bir talep türü seçin';
                    isValid = false;
                }
            } else {
                const errorElement = document.getElementById('queryTypeError');
                if (errorElement) {
                    errorElement.textContent = '';
                }
            }
        } 
        // Diğer durumlar için hata mesajını temizle
        else if (errorElement) {
            errorElement.textContent = '';
        }
        
        return isValid;
    }
    
    // Hata mesajı ayarlama fonksiyonu
    function setError(input, message) {
        input.classList.add('error');
        const errorId = input.id + 'Error';
        const errorElement = document.getElementById(errorId);
        
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    // Tüm hata mesajlarını temizleme fonksiyonu
    function clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        inputs.forEach(input => {
            input.classList.remove('error', 'touched');
        });
    }
    
    // E-posta doğrulama fonksiyonu
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Toast mesajı gösterme fonksiyonu
    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = 'toast';
        
        if (type === 'error') {
            toast.classList.add('error');
        }
        
        toast.classList.add('show');
        
        // 5 saniye sonra toast'ı gizle
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }
    
    // Ekran okuyuculara duyuru yapma fonksiyonu
    function announceToScreenReader(message) {
        screenReaderAnnouncement.textContent = message;
    }
});