const socket = io('/');

//streaming our own video
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
});
let myVideoStream;
//for accessing the camera and microphone from browser.
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);

        peer.on('call', call => {
            call.answer(stream)
            const video = document.createElement('video')
            call.on('stream', userVideoStream => {
                addVideoStream(video, userVideoStream)
            })
        })
    })
    
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID);
})


const connectToNewUser = (userId) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream',userVideoStream => {
        addVideoStream(video,userVideoStream)
    })
}

// const addVideoStream = (video, stream) => {
//     video.srcObject = stream;
//     video.addEventListener('loadedmetadata', () => {
//         video.play();
//     })
//     videoGrid.append(video)
// }

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',() => {
        video.play();
    })
    videoGrid.append(video);
}