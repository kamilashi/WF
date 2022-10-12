// 1(a) Initialize WebGL renderer
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setClearColor('black');  // background color

// 2. Create a new Three.js scene
const scene = new THREE.Scene();
// show global coordinate system
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// 3. Add a camera
const camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 500 );
camera.position.set(3,5,10);
//camera.rotation.z = Math.Pi*0.5;

// Add a mouse controller to move the camera
const controls = new THREE.OrbitControls( camera, renderer.domElement);
controls.zoomSpeed = 5.0;

// 4. Add light sources
scene.add(new THREE.AmbientLight('#606060'));
const light = new THREE.PointLight();
light.position.set(0,10,0);
scene.add(light);

var cubes;


// 5. Create an object made of a geometry and a material
function Init3D()
{
  cubes = new Array(tableRows);
  let z = 0;
  for(let i=0; i<tableRows;i++){ 
    cubes[i] = new Array(tableColumns);
    for(let j=0; j<tableColumns;j++){  
      let cubeGeom =  new THREE.BoxGeometry(1, 1, 1);
      let slotColor = table.slots[i][j].env;
      let cubeMat = new THREE.MeshStandardMaterial({color: slotColor});
      cubes[i][j] = new THREE.Mesh(cubeGeom, cubeMat);
      cubes[i][j].position.set(table.slots[i][j].coords.y,z,table.slots[i][j].coords.x);
      //cubes[i][j].position.set(i,y_up,j);
  
      scene.add(cubes[i][j]);
    }
  }
}

function updateScene()
{
  for(let i=0; i<tableRows;i++){ 
    for(let j=0; j<tableColumns;j++){  
  
      let slotColor = table.slots[i][j].env;
      let newMat = new THREE.MeshStandardMaterial({color: slotColor});
      cubes[i][j].material = newMat;
    }
  }
  console.log(cubes);

}

// 1(b) render the scene, i.e. take the contents of the scene and project to canvas using camera parameters
function render() {
  
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
}



render();

function DebugLog3D() {
    
  console.log(table);
}
