import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
}

const canvas = document.getElementById('webgl');
const scene = new THREE.Scene();

/**
 * Objects
*/
const whiteMat = new THREE.MeshBasicMaterial({color: 0xffffff});
const plane = new THREE.BoxGeometry(50,50,0.1);

const ground = new THREE.Mesh(plane,whiteMat);
ground.rotation.set(-Math.PI/2, 0, 0);
ground.name = "Plane";
scene.add(ground);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(3, 20, 15), new THREE.MeshBasicMaterial({color: 0x0000ff}));
sphere.position.set(-15,3,-8);

const capsule = new THREE.Mesh(new THREE.CapsuleGeometry(2, 2, 30), new THREE.MeshBasicMaterial({color: 0x0000ff}));
capsule.position.set(9,3,14);

const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(3, 0), new THREE.MeshBasicMaterial({color: 0x0000ff}));
ico.position.set(10, 2.6,-6);

const tetra = new THREE.Mesh(new THREE.TetrahedronGeometry(4, 0), new THREE.MeshBasicMaterial({color: 0x0000ff}));
tetra.position.set(-10, 2.3, 15);

scene.add(sphere, capsule, ico, tetra);

/**
 * Raycast
 */
const raycaster = new THREE.Raycaster()
let currentIntersect = null
let currentObject = null

// Mouse events
const mouse = new THREE.Vector2()

window.addEventListener('keydown', function(e) {

  // Onclick Escape remove the current object
  if (e.key == "Escape")
  {
    currentObject.material.color.setHex(0x0000ff);
    currentObject = null
  }
});

window.addEventListener('mousemove', function (event) 
{
  mouse.x = event.clientX / windowSize.width * 2 - 1
  mouse.y = - (event.clientY / windowSize.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  
  const intersects = raycaster.intersectObjects(scene.children);

  if(intersects.length)
      currentIntersect = intersects[0]
  else
      currentIntersect = null

  // Check if the Raycasted object is our ground. If yes then copu the position of selected object to the mouse position
  if(currentIntersect != null && currentObject != null && currentIntersect.object.name === "Plane")
    currentObject.position.set(currentIntersect.point.x,currentObject.position.y,currentIntersect.point.z)
})

window.addEventListener('click', () =>
{
  // Onclick set the current object as the object clicked on
  if(currentIntersect != null && currentIntersect.object.name != "Plane")
  {
    currentObject = currentIntersect.object;
    currentObject.material.color.setHex(0xff0000);
  }
})

// Camera
const camera = new THREE.PerspectiveCamera(75, windowSize.width / windowSize.height, 0.1, 100)
camera.position.set(0, 35, 35);

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// WebGL Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(windowSize.width, windowSize.height)

// Update the Canvas size incase the window is resized
window.addEventListener('resize', () =>
{
    // Update sizes
    windowSize.width = window.innerWidth
    windowSize.height = window.innerHeight

    // Update camera
    camera.aspect = windowSize.width / windowSize.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(windowSize.width, windowSize.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Update method called on every frame
const updateFrame = () =>
{
  controls.update()
  renderer.render(scene, camera)

  window.requestAnimationFrame(updateFrame)
}
updateFrame()