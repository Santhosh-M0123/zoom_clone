const socket = io("/");
const myVideo = document.createElement("video");
const videoGrid = document.getElementById("video_grid");
const peer = new Peer(undefined, {
  path: "/peerjs",
  port: "3001",
  host: "/",
});
// const selectedCamera = "user";
// var participant;
const allPeers = {};
myVideo.muted = true;
let myVideoStream;
socket.on("connect", () => {
  console.log("socket connected");
});

socket.on("user-disconnected", (userId) => {
  if (allPeers[userId]) allPeers[userId].close();
});

peer.on("open", (id) => {
  // console.log("opened", id);
  socket.emit("join-room", { Room_Id, id });
});
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true
  })
  .then((stream) => {
    myVideoStream = stream;
    console.log(stream);
    addVideoStream(myVideo, stream);
    socket.on("user-connected", (data) => {
      // console.log(data);
      participant = data.participant
      connectToNewUser(data.id, stream);
    });
    peer.on("call", (call) => {
      console.log("working");
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        console.log(userVideoStream);
        addVideoStream(video, userVideoStream);
      });

      call.on("error", (err) => {
        console.log("Failed to get local stream", err);
      });

      allPeers[userId] = call;
    });
  });

const connectToNewUser = (userId, stream) => {
  console.log(userId , stream);
  var call = peer.call(userId, stream);
  const video = document.createElement("video");

  call.on("stream", (userVideoStream) => {
    console.log("calling");
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

//muteUnmute

const muteUnmute = () => {
  console.log("mute button working");
  // console.log(myVideoStream);
  let audioTrackEnabled = myVideoStream.getAudioTracks()[0].enabled;
  // let audioTrackEnabled = myVideoStream.getAudioTracks()[0];
  console.log(audioTrackEnabled);
  if (audioTrackEnabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setUnmuteButton = () => {
  let html = `
  <i class="fa-solid fa-microphone-slash"></i>
  <span>unmute</span>
  `;

  document.querySelector(".mute").innerHTML = html;
};
const setMuteButton = () => {
  let html = `
  <i class="fa-solid fa-microphone"></i>
  <span>mute</span>
  `;

  document.querySelector(".mute").innerHTML = html;
};

//video feature

const pausePlayVideo = () => {
  console.log("mute button working");
  // console.log(myVideoStream);
  let audioTrackEnabled = myVideoStream.getVideoTracks()[0].enabled;
  // let audioTrackEnabled = myVideoStream.getAudioTracks()[0];
  // console.log(audioTrackEnabled);
  if (audioTrackEnabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setStopVideo();
  } else {
    setPlayVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const setStopVideo = () => {
  let html = `
  <i class="fa-solid fa-video-slash"></i>
  <span>play</span>
  `;

  document.querySelector(".video_").innerHTML = html;
};
const setPlayVideo = () => {
  let html = `
  <i class="fa-solid fa-video"></i>
  <span>stop</span>
  `;

  document.querySelector(".video_").innerHTML = html;
};

const AddParticipant = (participant) => {
  let html = `
  <i class="fa-solid fa-users"></i>
  <span>${participant}</span>
  <span>Participant</span>
  `;
  document.querySelector(".participant").innerHTML = html;
};
// AddParticipant();