window.onload = () => {
    // Mobile nav functionality
    const span = document.querySelector('.target');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');

    mobileNavToggle.addEventListener('click', () => {
        if (!mobileNav.classList.contains('is-open')) {
            mobileNav.classList.add('is-open');
            mobileNavToggle.classList.add('is-open');
        } else if (mobileNav.classList.contains('is-open')) {
            mobileNav.classList.remove('is-open');
            mobileNavToggle.classList.remove('is-open');
            span.style.transition = 'none';
        }
    });
    // Functionality for slide-down toggle list-group to edit poll
    const acc = document.getElementsByClassName('accordian');

    for (let k = 0; k < acc.length; k += 1) {
        acc[k].onclick = () => {
            /* Toggle between adding and removing the "active" class,
            to highlight the button that controls the panel */
            this.classList.toggle('active');
            /* Toggle between hiding and showing the active panel */
            const panel = this.nextElementSibling;
            if (panel.style.display === 'block') {
                panel.style.display = 'none';
            } else {
                panel.style.display = 'block';
            }
        };
    }

    if (window.location.pathname === '/users/profile') {
        // for adding more options to the poll schema
        const addOption = document.querySelector('.add-option');
        const pollFormAddButton = document.querySelector('.optionButton');

        let n = 2;

        pollFormAddButton.onclick = () => {
            // Functionality to open div to create a POll
            n += 1;
            const divFormGroup = document.createElement('div');
            divFormGroup.classList.add('form-group');

            const label = document.createElement('label');
            label.classList.add('bold');
            label.innerText = 'Option';
            label.setAttribute('for', `option${n}`);

            const input = document.createElement('input');
            input.classList.add('input-login');
            input.setAttribute('type', 'text');
            input.setAttribute('name', 'option');
            input.setAttribute('id', `option${n}`);
            input.setAttribute('placeholder', 'please enter another option for your poll');

            addOption.appendChild(divFormGroup);
            divFormGroup.appendChild(label);
            divFormGroup.appendChild(input);
        };

        // Hiding the create a new poll section
        const pollSection = document.querySelector('.new-poll');
        const closePoll = document.querySelector('.closePoll');
        const newPoll = document.querySelector('.newPollButton');

        newPoll.onclick = () => {
            if (pollSection.classList.contains('hide')) {
                pollSection.classList.remove('hide');
            }
        };
        closePoll.onclick = () => {
            if (!pollSection.classList.contains('hide')) {
                pollSection.classList.add('hide');
            }
        };
    }

    // Flash Messaging Alert Close button functionality
    const close = document.getElementsByClassName('closebtn');
    // Loop through all close buttons
    for (let i = 0; i < close.length; i += 1) {
        // When someone clicks on a close button
        close[i].onclick = function() {
            // Get the parent of <span class="closebtn"> (<div class="alert">)
            let div = this.parentElement;
            // Set the opacity of div to 0 (transparent)
            div.style.opacity = '0';
            // Hide the div after 600ms (the same amount of milliseconds it takes to fade out)
            setTimeout(() => { div.style.display = 'none'; }, 600);
        };
    }
};
