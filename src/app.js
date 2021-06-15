
const search = document.querySelector('.search');
const header = document.querySelector('.header');
const resultDiv = document.querySelector('.result');
const form = document.querySelector('.form');
const input = document.querySelector('.form__input');

const state = {
    api: 'https://geo.ipify.org/api/v1?apiKey=at_ANLvzNT2oad0i6CiELtNFGTYMIsPJ',
    mainInfo: {},
    mapZoomLevel: 13,
}

const getJSON = async function (url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
    }
}

const createMainInfo = (data) => {
    return {
        ip: data.ip,
        city: data.location.city,
        country: data.location.country,
        postalCode: data.location.postalCode,
        timezone: data.location.timezone,
        isp: data.isp,
        coords: [data.location.lat, data.location.lng]
    };
}

const isValidIPaddress = (ipaddress) => {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return true
    }
    return false
}

const isValidDomain = (domain) => {
    if (/^(([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]|[a-zA-Z0-9])\.)*[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(domain)) {
        return true;
    } else {
        return false;
    }
}
isValidDomain('003725.com');
const loadMap = (coords) => {
    if (!coords) coords = [54, 22];
    const map = L.map('map').setView(coords, state.mapZoomLevel);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        accessToken: 'pk.eyJ1IjoiemlxaW5nLXdhbmciLCJhIjoiY2tweTUwMWV2MDEzeDMxcGZiOTB2Z3VubyJ9.RqH7JVVJQ2_9g1QcYTexMA',
        id: 'mapbox/streets-v11',
    }).addTo(map);

    const myIcon = L.icon({
        iconUrl: 'src/images/icon-location.svg',
        iconSize: [40, 50]
    });
    L.marker(coords, { icon: myIcon }).addTo(map)
}

const centerResultDiv = function () {
    const resultHeight = resultDiv.offsetHeight;
    const headerHeight = header.offsetHeight;
    resultDiv.style.top = `${headerHeight - resultHeight / 2}px`;
}

const controlSearch = async function () {
    const inputString = input.value;
    let url;
    if (!inputString) { alert("😥Empty input."); return; }
    if (!isValidIPaddress(inputString) && !isValidDomain(inputString)) { alert('😥Invalid input, please try again'); return; }
    if (isValidIPaddress(inputString)) {
        url = state.api + '&ipAddress=' + inputString;
    }
    if (isValidDomain(inputString)) {
        url = state.api + '&domain=' + inputString;
    }
    const data = await getJSON(url);
    const info = createMainInfo(data);
    diaplayInfo(info);
    clearMap();
    loadMap(info.coords);
    input.value = "";
    input.focus();
}


const diaplayInfo = function (data) {
    const ipAddress = document.querySelector('.ip');
    const timezone = document.querySelector('.timezone');
    const location = document.querySelector('.location');
    const isp = document.querySelector('.isp');
    ipAddress.innerText = data.ip;
    location.innerText = data.city + ',' + data.country + '\n' + data.postalCode;
    timezone.innerText = data.timezone;
    isp.innerText = data.isp;
}

const clearMap = () => {
    if (map != undefined) {
        map.remove();
        const mapMarkUp = ' <div id="map"></div>';
        document.body.insertAdjacentHTML('afterend', mapMarkUp)
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    controlSearch();
});

const init = async function () {
    centerResultDiv();
    const data = await getJSON(state.api);
    state.mainInfo = createMainInfo(data);
    loadMap(state.mainInfo.coords);
    diaplayInfo(state.mainInfo)
}
init();

//console.log(state.mainInfo);




