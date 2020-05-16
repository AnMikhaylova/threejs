var canvas = document.getElementById("canvas");

window.onresize = resizeCanvas;
resizeCanvas();

var scene = new Scene(canvas);

render();

function render() {
  requestAnimationFrame(render);
  scene.update();
}

function resizeCanvas() {
  var canvas = document.getElementById("canvas");
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  if (scene) scene.onWindowResize();
}

function Scene(canvas) {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  var time = 0;

  var width = canvas.width;
  var height = canvas.height;

  var scene = new THREE.Scene();
  scene.background = new THREE.Color("#202020");

  var light = buildLights(scene);
  var camera = buildCamera(width, height);
  var renderer = buildRender(width, height);
  var mesh = addObjects(scene);
  var cylinder = addObjects2(scene);

  

  function buildLights(scene) {
    var light = new THREE.SpotLight("#fff", 0.9);
    light.position.y = 100;

    light.angle = 1.05;

    light.decacy = 2;
    light.penumbra = 1;

    light.shadow.camera.near = 10;
    light.shadow.camera.far = 1000;
    light.shadow.camera.fov = 30;

    scene.add(light);

    return light;
  }

  var globalLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(globalLight);

  function buildCamera(width, height) {
    var aspectRatio = width / height;
    var fieldOfView = 60;
    var nearPlane = 10;
    var farPlane = 500;
    var camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    camera.position.z = 100;

    return camera;
  }

  function buildRender(width, height) {
    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    var DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    return renderer;
  }

  function addObjects(scene) {
    var geometry = new THREE.SphereGeometry(30, 64, 64);
    var material = new THREE.MeshPhongMaterial({
      color: "#99ccff",
      transparent: true,
      opacity: 0.8,
      shininess: 1,
    });

    var snowflakes = new THREE.TextureLoader().load("unnamed3.png");
    snowflakes.magFilter = THREE.NearestFilter;
    material.map = snowflakes;

    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
  }

  function addObjects2(scene) {
    var geometry = new THREE.CylinderGeometry(2.3, 4.6, 3, 32);
   
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    var cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.y=33;
    scene.add(cylinder);
    

    return cylinder;
  }

  this.update = function () {
    time++;

    light.position.x = Math.sin(time * 0.01) * 200;

    // mesh.rotation.x += 0.001;
    mesh.rotation.y += 0.001;
    // mesh.rotation.z += 0.001;

    cylinder.rotation.x += 0.001;
    // cylinder.rotation.y += 0.001;
    // cylinder.rotation.z += 0.001;

    renderer.clear();
    renderer.render(scene, camera);
  };

  this.onWindowResize = function () {
    var canvas = document.getElementById("canvas");
    var width = document.body.clientWidth;
    var height = document.body.clientHeight;
    canvas.width = width;
    canvas.height = height;

    camera = buildCamera(width, height);

    renderer.setSize(width, height);
  };
}
