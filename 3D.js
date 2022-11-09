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

let Models = 
{
  player1:0,
  player2:0,
  creatures : new Array(worlds.length),
  cubes:0
}
//var cubes;

const Materials = 
{
player : new THREE.MeshStandardMaterial({color: 'blue'}),
creature : new THREE.MeshStandardMaterial({color: 'red'}),
}

function Init3D()
{
  Models.cubes = new Array(tableRows);
  let z = 0;
  for(let i=0; i<tableRows;i++){ 
    Models.cubes[i] = new Array(tableColumns);
    for(let j=0; j<tableColumns;j++){  
      let cubeGeom =  new THREE.BoxGeometry(1, 1, 1);
      let slotColor = table.slots[i][j].env;
      let cubeMat = new THREE.MeshStandardMaterial({color: slotColor});
      Models.cubes[i][j] = new THREE.Mesh(cubeGeom, cubeMat);
      Models.cubes[i][j].position.set(table.slots[i][j].coords.y,z,table.slots[i][j].coords.x);
      //cubes[i][j].position.set(i,y_up,j);
  
      scene.add(Models.cubes[i][j]);
    }
  }

  initializeCreatures();
  initializePlayers();

  Models.creatures.forEach(worldCreatures => {
    worldCreatures.forEach(creatureModel => {
      scene.add(creatureModel);
      //console.log(creatureModel);
    });
  });

  updateScene();
}

function updateScene()
{
  Models.creatures.forEach(worldCreatures => {
    worldCreatures.forEach(creatureModel => {
      creatureModel.visible = false;
    });
  });

  for(let i=0; i<tableRows;i++){ 
    for(let j=0; j<tableColumns;j++){  
  
      const slotColor = table.slots[i][j].env;
      const newMat = new THREE.MeshStandardMaterial({color: slotColor});
      Models.cubes[i][j].material = newMat;

    

      if(table.slots[i][j].content!=undefined) //to-do: separate creatures from other content
      {
        let contentIndex = table.slots[i][j].content.index;
        let worldIndex = table.slots[i][j].WI;
        Models.creatures[worldIndex][contentIndex].visible = true;
        //move to game.js logic later!
        console.log( table.slots[i][j].content.toString+ " creating path tree...");
        table.slots[i][j].content.createPathTree();
      }
    }
  }

}


function initializeCreatures()
{
  worlds.forEach(world => {
    Models.creatures[world.WI] = new Array();
    for(let i=0; i<tableRows;i++){ 
      //creature[i] = new Array(tableColumns);
      for(let j=0; j<tableColumns;j++){  
        if(world.creatures[i][j]!=undefined){
          let creatureBall = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32,16), Materials.creature);
          creatureBall.position.set(j,0.7,i);
          creatureBall.visible = false;
          Models.creatures[world.WI].push(creatureBall);
        }
      }
    }
  });
}

function initializePlayers()
{
  Models.player1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32,16), Materials.player);
  Models.player1.position.set(player.position.x,0.7,player.position.y);
  scene.add(Models.player1);
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
