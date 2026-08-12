(function () {
    const STORAGE_KEY = 'evergreen-ready-upgrade-form-data';

    function safeGetStorageItem(key) {
        try {
            return sessionStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function safeSetStorageItem(key, value) {
        try {
            sessionStorage.setItem(key, value);
        } catch (error) {
            return false;
        }

        return true;
    }

    function safeRemoveStorageItem(key) {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            return false;
        }

        return true;
    }

    function getControlValue(form, name) {
        const control = form.elements.namedItem(name);

        if (!control || typeof control.value === 'undefined') {
            return '';
        }

        return control.value;
    }

    function setControlValue(form, name, value) {
        const control = form.elements.namedItem(name);

        if (!control || typeof control.value === 'undefined') {
            return;
        }

        control.value = value || '';
    }

    const readyUpgradeSection = document.querySelector('.ready-upgrade-section');
    const contactForm = document.querySelector('.contact-form');

    if (readyUpgradeSection) {
        const readyUpgradePrimaryForm = readyUpgradeSection.querySelector('.ready-upgrade-column--middle .ready-upgrade-form');
        const readyUpgradeSecondaryForm = readyUpgradeSection.querySelector('.ready-upgrade-column:not(.ready-upgrade-column--middle) .ready-upgrade-form');

        if (readyUpgradePrimaryForm && readyUpgradeSecondaryForm) {
            readyUpgradePrimaryForm.addEventListener('submit', function (event) {
                event.preventDefault();

                if (!readyUpgradePrimaryForm.reportValidity()) {
                    return;
                }

                if (!readyUpgradeSecondaryForm.reportValidity()) {
                    return;
                }

                const payload = {
                    name: getControlValue(readyUpgradePrimaryForm, 'name'),
                    email: getControlValue(readyUpgradePrimaryForm, 'email'),
                    businessType: getControlValue(readyUpgradePrimaryForm, 'business-type'),
                    businessName: getControlValue(readyUpgradeSecondaryForm, 'business-name'),
                    phone: getControlValue(readyUpgradeSecondaryForm, 'phone'),
                    message: getControlValue(readyUpgradeSecondaryForm, 'message'),
                };

                if (safeSetStorageItem(STORAGE_KEY, JSON.stringify(payload))) {
                    window.location.href = 'contact.html';
                }
            });
        }
    }

    if (contactForm) {
        const storedPayload = safeGetStorageItem(STORAGE_KEY);

        if (storedPayload) {
            try {
                const payload = JSON.parse(storedPayload);

                setControlValue(contactForm, 'name', payload.name);
                setControlValue(contactForm, 'business-name', payload.businessName);
                setControlValue(contactForm, 'email', payload.email);
                setControlValue(contactForm, 'phone', payload.phone);
                setControlValue(contactForm, 'business-type', payload.businessType);
                setControlValue(contactForm, 'message', payload.message);
            } catch (error) {
                // Ignore malformed stored data and leave the form untouched.
            }

            safeRemoveStorageItem(STORAGE_KEY);

            window.setTimeout(function () {
                contactForm.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }, 100);
        }
    }
})();
