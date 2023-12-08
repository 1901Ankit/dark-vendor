
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Text } from "troika-three-text";
import { gsap, Power1 } from "gsap";
import React, { Suspense } from "react";

const player = document.querySelector(".player");
const playerClose = document.querySelector(".player-close");
const playerSource = document.querySelector(".player-source");
const header = document.querySelector("header");
const h1 = document.querySelector("h1");
const footer = document.querySelector("footer");

let touchValue = 1;
let videoLook = false;
let scrollI = 30.0;
let initialPositionMeshY = -1;
let initialRotationMeshY = Math.PI * 0.9;
let planeClickedIndex = -1;
let isLoading = false;
let lastPosition = {
  px: null,
  py: null,
  pz: null,
  rx: null,
  ry: null,
  rz: null,
};


const debugObject = {};

const canvas = document.querySelector(".main-webgl");

const scene = new THREE.Scene();
scene.background = new THREE.Color("");

const backgroundScene = new THREE.Scene("#000000");



const sizesCanvas = {
  width: window.innerWidth,
  height: window.innerHeight,
};



const raycatser = new THREE.Raycaster();
let currentIntersect = null;

let mouse = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizesCanvas.width) * 2 - 1;
  mouse.y = -(e.clientY / sizesCanvas.height) * 2 + 1;
});

const music = new Audio("sounds/music.mp3");


const respiration = new Audio("sounds/respiration.mp3");


const loadingManager = new THREE.LoadingManager(
  () => {
    window.setTimeout(() => {
   
      continueAnimation()
      
    }, 50);
  },
  (itemUrl, itemsLoaded, itemsTotal) => {
    const progressRatio = itemsLoaded / itemsTotal;


    header.style.width = `${(progressRatio * 550).toFixed(0)}px`;
  }
);

const continueAnimation = () => {
 

  gsap.from(camera.position, 1.5, {
    x: 4.0,
    z: -8.5,
    y: 3.0,
  });

  setTimeout(() => {
    groupPlane.visible = true;
    groupText.visible = true;
    isLoading = true;
  }, 250);
};

    const raw_images=[
      "./images/img1.jpg","./images/img2.jpg","./images/img3.jpg","./images/img4.jpg","./images/img5.jpg","./images/img6.jpg","./images/img7.jpg","./images/img8.jpg","./images/img9.jpg","./images/img10.jpg"
    ];
const gltfLoader = new GLTFLoader(loadingManager);
let models = [];

let detailsImage = [
  {
    url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
    name: "REACT",
  
  },
  
  {
    url: "https://www.youtube.com/watch?v=k5E2AVpwsko",
    name: "ANGULAR",
  
  },
  {
    url: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
    name: "JAVA SCRIPT"
  },
  {
    url: "https://www.youtube.com/watch?v=G3e-cpL7ofc",
    name: "HTML & CSS"
  },
  {
    url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
    name: "PYTHON"
  },
  {
    url: "https://www.youtube.com/watch?v=8sAyPDLorek",
    name: "FLUTTER"
  },
  {
    url: "https://www.youtube.com/watch?v=sTeoEFzVNSc",
    name: "CHAT GPT"
  },
  {
    url: "https://www.youtube.com/watch?v=7S_tz1z_5bA",
    name: "SQL"
  },
  {
    url: "https://www.youtube.com/watch?v=tFyd2B29g8w",
    name: "GOLANG"
  },
  {
    url: "https://www.youtube.com/watch?v=a7_WFUlFS94",
    name: "PHP",
  },
];


gltfLoader.load(
  "models/Dark_vador/scene.gltf",
  (gltf) => {
    gltf.scene.scale.set(5, 5, 5);
    gltf.scene.position.y = initialPositionMeshY;
    gltf.scene.rotation.y = initialRotationMeshY;

    scene.add(gltf.scene);
    models.push(gltf.scene);

    scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.material.envMapIntensity = debugObject.envMapIntensity;
        child.material.needsUpdate = true;
      }
    });
  },
  undefined,
  (err) => {
    console.log(err);
  }
);

let startTouch = 0;

gltfLoader.load(
  "models/Rock/scene.gltf",
  (gltf) => {
    gltf.scene.scale.set(2.2, 2, 2.2);
    gltf.scene.position.y = initialPositionMeshY - 1.73;
    gltf.scene.rotation.y = initialRotationMeshY;

    scene.add(gltf.scene);
    models.push(gltf.scene);

    scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.material.envMapIntensity = debugObject.envMapIntensity;
        child.material.needsUpdate = true;
      }
    });

    if ("ontouchstart" in window) {
      window.addEventListener(
        "touchstart",
        (e) => {
          startTouch = e.touches[0].clientY;
        },
        false
      );

      window.addEventListener(
        "touchmove",
        (e) => {
          // animationScroll(e)
          if (e.touches[0].clientY < startTouch) {
            startTouch = e.touches[0].clientY;
            animationScroll(e, true, startTouch, "up");
          } else {
            startTouch = e.touches[0].clientY;
            animationScroll(e, true, startTouch, "down");
          }
        },
        false
      );
    } else window.addEventListener("wheel", (e) => animationScroll(e), true);
  },
  undefined,
  (err) => {
    console.log(err);
  }
);

debugObject.envMapIntensity = 5;

const camera = new THREE.PerspectiveCamera(
  75,
  sizesCanvas.width / sizesCanvas.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = -6;
scene.add(camera);

const backgroundCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 0);

const controls = new OrbitControls(camera, canvas);
controls.enabled = false;
controls.enableZoom = false;

const ambientLight = new THREE.AmbientLight(0xff0000, 1.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 4);
pointLight.position.set(-5.5, 5.5, -5);
scene.add(pointLight);

const vertexBackgroundShaders=`varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
}`;
const fragmentBackgroundShaders=`
uniform float uScrollI;
uniform float uTime;

varying vec2 vUv;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
    vec2 pos = vec2(vec2(vUv) * 2.0);
    pos += sin(uScrollI * 0.007);

    float strength = noise(pos * 2.0);

    vec3 color1 = vec3(0.4118, 0.0039, 0.0039);
    vec3 color2 = vec3(0.2745, 0.0, 0.0);

    vec3 mixedColor = mix(color1, color2, strength);

    gl_FragColor = vec4(mixedColor, 1.0);
}
`;
const backgroundPlane = new THREE.PlaneGeometry(2, 2);
const backgroundMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexBackgroundShaders,
  fragmentShader: fragmentBackgroundShaders,

  uniforms: {
    uScrollI: { value: scrollI },
    uResoltion: {
      value: new THREE.Vector2(sizesCanvas.width, sizesCanvas.height),
    },
    uTime: { value: 0.0 },
  },
});

backgroundScene.add(new THREE.Mesh(backgroundPlane, backgroundMaterial));

const groupPlane = new THREE.Group();
const groupText = new THREE.Group();
groupPlane.visible = false;
groupText.visible = false;
scene.add(groupPlane, groupText);

const planeGeometry = new THREE.PlaneGeometry(2, 1.25, 32, 32);
const planesMaterial = [];

const vertexShadersss = 

  `
  uniform float uTime;

  varying vec2 vUv;
  
  void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      modelPosition.z += sin(modelPosition.x * 5.0 - uTime) * 0.1;
  
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;
  
      gl_Position = projectionPosition;
  
      vUv = uv;
  }
  `;


const fragmentShadersss = 

   `
  uniform sampler2D uTexture;
  uniform float uTouch;
  uniform float uTime;
  
  varying vec2 vUv;
  
  void main() {
      vec4 texture = texture2D(uTexture, vUv);
      vec3 gray = vec3((texture.r + texture.g + texture.b) * 0.3);
  
      float strength = distance(vUv, vec2(1.2, 0.5));
      strength -= - sin(uTouch - 0.5) * 3.0;
  
      vec3 color = mix(texture.rgb, gray.rgb, smoothstep(strength, strength - 0.2, uTouch));
  
      gl_FragColor = vec4(color, 1.0);
  }
  `;



for (let i = 0; i < 10; i++) {
  // console.log("dfd",images[i])
  
  planesMaterial.push(
    new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      vertexShader: vertexShadersss,
      fragmentShader: fragmentShadersss,
      uniforms: {
        uScrollI: { value: scrollI },
        uTexture: {value:new THREE.TextureLoader().load(raw_images[i]) },
        
        uTime: { value: 0.0 },
        uTouch: { value: touchValue },
      },
    })
  );

  const plane = new THREE.Mesh(planeGeometry, planesMaterial[i]);
  plane.position.y = i - 14.2;
  plane.position.x = -Math.cos(i) * Math.PI;
  plane.position.z = -Math.sin(i) * Math.PI;
  plane.lookAt(0, plane.position.y, 0);

  groupPlane.add(plane);

  const newText = new Text();
  newText.text = detailsImage[i].name;
  newText.fontSize = 0.100;
  newText.position.y = plane.position.y;
  newText.position.x = plane.position.x;
  newText.position.z = plane.position.z;

  groupText.add(newText);
}

const particuleGeometry = new THREE.BufferGeometry();
const particulesCount = 30;
const particulesPositions = new Float32Array(particulesCount * 3);
const particulesScales = new Float32Array(particulesCount);

for (let i = 0; i < particulesCount; i++) {
  const i3 = i * 3;

  particulesPositions[i3] = (Math.random() - 0.5) * 10;
  particulesPositions[i3 + 1] = Math.random() * 1.5 - 2;
  particulesPositions[i3 + 2] = (Math.random() - 0.5) * 10 + 2.5;

  particulesScales[i] = Math.random();
}

particuleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(particulesPositions, 3)
);
particuleGeometry.setAttribute(
  "aScale",
  new THREE.BufferAttribute(particulesScales, 1)
);
 const vertexParticulesShaders =`
 uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin((uTime * 0.25) + (modelPosition.y * 5.0)) * 2.0;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= (1.0 / - viewPosition.z);
}
 `;
 const fragmentParticulesShaders =`
 void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
 `;
const particulesMaterial = new THREE.ShaderMaterial({
  blanding: THREE.AdditiveBlending,
  vertexShader: vertexParticulesShaders,
  fragmentShader: fragmentParticulesShaders,
  uniforms: {
    uTime: { value: 0.0 },
    uSize: { value: 10.0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  },
});

const particules = new THREE.Points(particuleGeometry, particulesMaterial);
scene.add(particules);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizesCanvas.width, sizesCanvas.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.autoClear = false;

const animationScroll = (e, touchEvent, value, downOrUp) => {
  let deltaY;

  if (touchEvent) deltaY = value;
  else deltaY = e.deltaY;

  if (videoLook === false && isLoading) {
    // Known up or down
    if (touchEvent && downOrUp === "down" && scrollI > 0) scrollI--;
    else if (!touchEvent && deltaY < 0 && scrollI > 0) scrollI--;

    if (scrollI <= 435 && scrollI >= 0 && models.length === 2) {
      if (touchEvent && downOrUp === "up") scrollI++;
      else if (!touchEvent && deltaY > 0) scrollI++;
      const speed = 0.004;

      models.forEach((model, index) => {
        model.rotation.y = initialRotationMeshY - scrollI * 0.01354; 

        if (index === 0)
          model.position.y = initialPositionMeshY - scrollI * (speed * 0.9);
        else if (index === 1)
          model.position.y =
            initialPositionMeshY - 1.73 - scrollI * (speed * 0.8);

        model.position.z = -scrollI * (speed * 0.75);
      });

      for (let i = 0; i < groupPlane.children.length; i++) {
        const plane = groupPlane.children[i];
        const text = groupText.children[i];

        plane.position.z = -Math.sin(i + 1 * scrollI * (speed * 10)) * Math.PI;
        plane.position.x = -Math.cos(i + 1 * scrollI * (speed * 10)) * Math.PI;
        plane.position.y = i - 14.2 + scrollI * (speed * 10);

        plane.lookAt(0, plane.position.y, 0);

        text.position.z = plane.position.z - 0.5;
        text.position.x = plane.position.x;
        text.position.y = plane.position.y - 0.3;

        text.lookAt(
          plane.position.x * 2,
          plane.position.y - 0.3,
          plane.position.z * 2
        );
      }
    }
  }
};

function getVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
}

window.addEventListener("click", () => {
  handlePlane();
});

const handlePlane = () => {
  if (currentIntersect && videoLook === false && isLoading) {
    for (let i = 0; i < groupPlane.children.length; i++) {
      if (groupPlane.children[i] === currentIntersect.object) {
        planeClickedIndex = i;
        music.pause();
        respiration.pause();

        lastPosition = {
          px: groupPlane.children[i].position.x,
          py: groupPlane.children[i].position.y,
          pz: groupPlane.children[i].position.z,
          rx: groupPlane.children[i].rotation.x,
          ry: groupPlane.children[i].rotation.y,
          rz: groupPlane.children[i].rotation.z,
        };

        gsap.to(groupPlane.children[i].position, 0.5, {
          z: camera.position.z + 0.5,
          x: camera.position.x,
          y: camera.position.y,
          ease: Power1.easeIn,
        });

        gsap.to(groupPlane.children[i].rotation, 0.5, {
          z: 0,
          x: 0,
          y: 0,
          ease: Power1.easeIn,
        });

        const videoId = getVideoId(detailsImage[i].url);
        playerSource.src = "https://www.youtube.com/embed/" + videoId;

        setTimeout(() => {
          player.style.visibility = "visible";

          gsap.to(player, 0.5, {
            opacity: 1,
            ease: Power1.easeIn,
          });
        }, 400);

        videoLook = true;
      }
    }
  }
};

playerClose.addEventListener("click", () => {
  playerSource.src = "";
  music.play();
  respiration.play();

  gsap.to(player, 0.5, {
    opacity: 0,
    ease: Power1.easeIn,
  });
  player.style.visibility = "hidden";

  gsap.to(groupPlane.children[planeClickedIndex].position, 0.5, {
    x: lastPosition.px,
    y: lastPosition.py,
    z: lastPosition.pz,
    ease: Power1.easeIn,
  });

  gsap.to(groupPlane.children[planeClickedIndex].rotation, 0.5, {
    x: lastPosition.rx,
    y: lastPosition.ry,
    z: lastPosition.rz,
    ease: Power1.easeIn,
  });

  planeClickedIndex = -1;

  setTimeout(() => {
    videoLook = false;
  }, 500);
});

let goalValue = 0;

const changeTouchValue = (index) => {
  if (index >= 0) {
    const interval = setInterval(() => {
      if (goalValue === 1) touchValue += 0.01;
      else if (goalValue === 0) touchValue -= 0.01;

      groupPlane.children[index].material.uniforms.uTouch.value = touchValue;

      if (parseFloat(touchValue.toFixed(1)) === goalValue) {
        clearInterval(interval);
        goalValue = goalValue === 0 ? 1 : 0;
      }
    }, 7);
  }
};

const clock = new THREE.Clock();

let callChangeTouchValue = 0;
let touchI = -1;

const init = () => {
  const elapsedTime = clock.getElapsedTime();

  planesMaterial.forEach((plane) => {
    plane.uniforms.uTime.value = elapsedTime;
    plane.uniforms.uScrollI.value = scrollI;
  });
  backgroundMaterial.uniforms.uScrollI.value = scrollI;
  backgroundMaterial.uniforms.uTime.value = elapsedTime;
  particulesMaterial.uniforms.uTime.value = elapsedTime;

  if (!("ontouchstart" in window)) raycatser.setFromCamera(mouse, camera);
  const intersects = raycatser.intersectObjects(groupPlane.children);

  if (isLoading) {
    if (intersects.length === 1) {
      if (currentIntersect === null) {
        currentIntersect = intersects[0];
      } else {
        for (let i = 0; i < groupPlane.children.length; i++) {
          if (groupPlane.children[i] === currentIntersect.object) {
            if (callChangeTouchValue === 0) {
              touchI = i;
              changeTouchValue(i);
              callChangeTouchValue = 1;
              document.body.style.cursor = "pointer";
            }
          }
        }
      }
    } else {
      if (callChangeTouchValue === 1 && touchI >= 0) {
        changeTouchValue(touchI);
        callChangeTouchValue = 0;
        document.body.style.cursor = "auto";
        currentIntersect = null;
        touchI = -1;
      }
    }
  }

  renderer.render(scene, camera);
  renderer.render(backgroundScene, backgroundCamera);

  window.requestAnimationFrame(init);
  
};



init();

function App() {
  return (
    <div className="App">
      
     
    </div>
  );
}

export default App;
