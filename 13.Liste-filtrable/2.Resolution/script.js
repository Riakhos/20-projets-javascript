// https://randomuser.me/api/?nat=fr&results=50

const tableResults = document.querySelector('.table__results');
const userListServerInfo = document.querySelector('.user-list__server-info');
const loader = document.querySelector('.user-list__loader');

let dataArray

async function getUsers() {
    loader.classList.add('js-active-loader');
    userListServerInfo.textContent = "";

    try {
        const response = await fetch('https://randomuser.me/api/?nat=fr&results=50');

        if (!response.ok) throw new Error();

        const { results } = await response.json()
        console.log(results)
        dataArray = results.sort((a, b) => a.name.last.localeCompare(b.name.last));

    } catch (error) {
        userListServerInfo.textContent = "Erreur lors de l'appel de données"
        return;
    }
    finally {
        loader.classList.remove('js-active-loader');
    }

    createUserList(dataArray);
}
getUsers();

function createUserList(array) {
    const fragment = document.createDocumentFragment();

    array.forEach(user => {
        const tr = document.createElement('tr');
        tr.className = 'table__content-row';

        tr.innerHTML = `
            <td class="table__data table__data-info">
                <div class="table__data-content-wrapper">
                    <img src="" alt="" class="table__data-img">
                    <span class="js-td-name"></span>
                </div>
            </td>
            <td class="table__data table__data-email">
                <span class="js-td-email"></span>
            </td>
            <td class="table__data table__data-phone">
                <span class="js-td-phone-number"></span>
            </td>
        `;

        tr.querySelector('.table__data-img').src = user.picture.thumbnail;
        tr.querySelector('.js-td-name').textContent = `${user.name.last} ${user.name.first}`;
        tr.querySelector('.js-td-email').textContent = user.email;
        tr.querySelector('.js-td-phone-number').textContent = user.phone;
        fragment.appendChild(tr);
    });

    tableResults.appendChild(fragment);
}

const searchInput = document.querySelector('.user-list__input');

searchInput.addEventListener('input', filterData);

function filterData(e) {
    tableResults.textContent = "";
    userListServerInfo.textContent = "";
    const searchedString = e.target.value.trim().toLowerCase();

    const filteredUsersArray = dataArray.filter(userData => searchForOccurences(userData, searchedString));

    if (!filteredUsersArray.length) {
        userListServerInfo.textContent = "Pas de résultats trouvés.";
        return;
    } else {
        createUserList(filteredUsersArray);
    }
}

function searchForOccurences(userData, searchedString) {
    const searchedWords = searchedString.split(/\s+/);

    const firstName = userData.name.first.toLowerCase();
    const lastName = userData.name.last.toLowerCase();

    if (searchedWords.length === 1) {
        return (
            firstName.startsWith(searchedWords[0]) ||
            lastName.startsWith(searchedWords[0])
        );
    }

    if (searchedWords.length === 2) {
        return (
            (firstName.startsWith(searchedWords[0]) && lastName.startsWith(searchedWords[1])) ||
            (lastName.startsWith(searchedWords[0]) && firstName.startsWith(searchedWords[1]))
        );
    }

    return false;
}