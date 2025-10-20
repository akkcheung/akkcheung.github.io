import { getUsers, getCurrentUser, setCurrentUser, addUser } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const userDropdown = document.getElementById('user-dropdown');
    const addUserBtn = document.getElementById('add-user-btn');
    const memoryGameLink = document.getElementById('memory-game-link');
    const reactionGameLink = document.getElementById('reaction-game-link');
    const stroopGameLink = document.getElementById('stroop-game-link');
    const trailMakingLink = document.getElementById('trail-making-link');
    const mirrorGameLink = document.getElementById('mirror-game-link');
    const chartsLink = document.getElementById('charts-link');

    function updateGameLinksState() {
        const currentUser = getCurrentUser();
        const links = [memoryGameLink, reactionGameLink, stroopGameLink, trailMakingLink, mirrorGameLink, chartsLink];

        if (currentUser) {
            links.forEach(link => {
                link.classList.remove('disabled');
                if (link.dataset.href) {
                    link.href = link.dataset.href;
                }
            });
        } else {
            links.forEach(link => {
                link.classList.add('disabled');
                link.dataset.href = link.href;
                link.href = 'javascript:void(0);';
            });
        }
    }

    function populateUserDropdown() {
        userDropdown.innerHTML = '';
        const users = getUsers();
        const currentUser = getCurrentUser();

        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Please pick user below';
        defaultOption.disabled = true;
        if (!currentUser) {
            defaultOption.selected = true;
        }
        userDropdown.appendChild(defaultOption);

        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user;
            option.textContent = user;
            if (user === currentUser) {
                option.selected = true;
            }
            userDropdown.appendChild(option);
        });
        updateGameLinksState();
    }

    addUserBtn.addEventListener('click', () => {
        const newUser = prompt('Enter new user name:');
        if (newUser && !getUsers().includes(newUser)) {
            addUser(newUser);
            setCurrentUser(newUser);
            populateUserDropdown();
        } else if (getUsers().includes(newUser)) {
            alert('User already exists.');
        }
    });

    userDropdown.addEventListener('change', () => {
        const selectedUser = userDropdown.value;
        const currentUser = getCurrentUser();
        const verification = prompt(`Please enter the user name "${selectedUser}" to confirm:`);

        if (verification === selectedUser) {
            setCurrentUser(selectedUser);
            updateGameLinksState();
        } else {
            alert('Verification failed. User not switched.');
            userDropdown.value = currentUser || 'Please pick user below';
        }
    });

    populateUserDropdown();
});