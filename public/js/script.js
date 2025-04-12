const socketio = io(); // this will send the connection request in the backend
console.log("hey")

if (navigator.geolocation) {
    console.log(navigator.geolocation)
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude, speed } = position.coords;
        console.log("speed", speed)
        var username = localStorage.getItem("username");
        if (!username) {
            username = prompt("Hi , What is your name ?");
            if (username) {
                localStorage.setItem("username", username);
            } else {
                username = "Guest";
            }
        }
        socketio.emit("send-location", { latitude: latitude, longitude: longitude, username: username, speed: speed })
    }, (error) => {
        console.error(error);
    }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 4000
    })
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Amit Coding Practice"
}).addTo(map);

const marker = {

}
const movingIcon = L.divIcon({
    className: 'fa',
    html: '<i class="fas fa-running"></i>',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
});

const sittingIcon = L.divIcon({
    className: 'fa',
    html: '<i class="fas fa-user"></i>',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
});

socketio.on("receive-location", (data) => {
    const { id, latitude, longitude, username, speed } = data;
    const icon = speed > 0.1 ? movingIcon : sittingIcon;
    const height = (icon == movingIcon) ? -30 : -21;
    console.log(height);
    map.setView([latitude, longitude]);
    if (marker[id]) {
        marker[id].setLatLang([latitude, longitude]);
    } else {
        marker[id] = L.marker([latitude, longitude], { icon: icon }).addTo(map).bindTooltip(username, { permanent: true, direction: "top", offset: [0, height] });
    }
})

socketio.on("user-disconnected", (id) => {
    if (marker[id]) {
        map.removeLayer(marker[id]);
        delete marker[id];
        localStorage.removeItem("username");

    }
});