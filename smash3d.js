// IMPORTANT: Ensure Babylon.js is added as an external resource,
// for example: https://cdn.babylonjs.com/babylon.js

window.addEventListener("DOMContentLoaded", function () {
  // Get canvas and create Engine.
  var canvas = document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);

  // Global variable for the player's fighter.
  var playerMesh = null;
  var scene = createScene();

  // Run the render loop.
  engine.runRenderLoop(function () {
    scene.render();
  });

  // Resize event.
  window.addEventListener("resize", function () {
    engine.resize();
  });

  // ----------------- Scene Creation -----------------
  function createScene() {
    var scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;

    // Create a FollowCamera (third-person view).
    var camera = new BABYLON.FollowCamera(
      "FollowCam",
      new BABYLON.Vector3(0, 10, -10),
      scene
    );
    camera.radius = 15;
    camera.heightOffset = 4;
    camera.rotationOffset = 180;
    camera.cameraAcceleration = 0.05;
    camera.maxCameraSpeed = 20;
    camera.lockedTarget = null; // Will be set when a fighter is chosen.
    camera.attachControl(canvas, true);

    // Lighting.
    var light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    light.intensity = 0.9;

    // Create a basic arena floor (immediate essential element).
    var arenaFloor = BABYLON.MeshBuilder.CreateGround(
      "arenaFloor",
      { width: 300, height: 300 },
      scene
    );
    var arenaFloorMat = new BABYLON.StandardMaterial("arenaFloorMat", scene);
    arenaFloorMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    arenaFloor.material = arenaFloorMat;
    arenaFloor.checkCollisions = true;

    // Set up input for movement.
    var inputMap = {};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyDownTrigger,
        function (evt) {
          inputMap[evt.sourceEvent.key] = true;
        }
      )
    );
    scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyUpTrigger,
        function (evt) {
          inputMap[evt.sourceEvent.key] = false;
        }
      )
    );

    scene.onBeforeRenderObservable.add(function () {
      if (playerMesh) {
        var delta = engine.getDeltaTime() / 1000;
        var speed = 10;
        var move = BABYLON.Vector3.Zero();
        if (inputMap["w"] || inputMap["ArrowUp"]) {
          move = move.add(new BABYLON.Vector3(0, 0, -speed * delta));
        }
        if (inputMap["s"] || inputMap["ArrowDown"]) {
          move = move.add(new BABYLON.Vector3(0, 0, speed * delta));
        }
        if (inputMap["a"] || inputMap["ArrowLeft"]) {
          move = move.add(new BABYLON.Vector3(-speed * delta, 0, 0));
        }
        if (inputMap["d"] || inputMap["ArrowRight"]) {
          move = move.add(new BABYLON.Vector3(speed * delta, 0, 0));
        }
        playerMesh.moveWithCollisions(move);
      }
    });

    return scene;
  }

  // ----------------- Fighter Creation Functions -----------------
  // Create Mario.
  function createMario(scene) {
    var root = new BABYLON.TransformNode("MarioRoot", scene);
    // Torso.
    var torso = BABYLON.MeshBuilder.CreateBox(
      "marioTorso",
      { width: 1, height: 1.5, depth: 0.6 },
      scene
    );
    torso.position.y = 0.75;
    var torsoMat = new BABYLON.StandardMaterial("marioTorsoMat", scene);
    torsoMat.diffuseColor = new BABYLON.Color3(0.8, 0, 0);
    torso.material = torsoMat;
    torso.parent = root;
    // Head.
    var head = BABYLON.MeshBuilder.CreateSphere(
      "marioHead",
      { diameter: 0.8 },
      scene
    );
    head.position.y = 1.6;
    var headMat = new BABYLON.StandardMaterial("marioHeadMat", scene);
    headMat.diffuseColor = new BABYLON.Color3(1, 0.87, 0.77);
    head.material = headMat;
    head.parent = root;
    // Cap.
    var cap = BABYLON.MeshBuilder.CreateSphere(
      "marioCap",
      { diameter: 0.9 },
      scene
    );
    cap.scaling.y = 0.5;
    cap.position.y = 2.05;
    var capMat = new BABYLON.StandardMaterial("marioCapMat", scene);
    capMat.diffuseColor = new BABYLON.Color3(0.8, 0, 0);
    cap.material = capMat;
    cap.parent = root;
    // Arms.
    var leftArm = BABYLON.MeshBuilder.CreateCylinder(
      "marioLeftArm",
      { height: 1, diameter: 0.3 },
      scene
    );
    leftArm.rotation.z = Math.PI / 2;
    leftArm.position = new BABYLON.Vector3(-0.75, 1.2, 0);
    var armMat = new BABYLON.StandardMaterial("marioArmMat", scene);
    armMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.8);
    leftArm.material = armMat;
    leftArm.parent = root;
    var rightArm = leftArm.clone("marioRightArm");
    rightArm.position.x = 0.75;
    rightArm.parent = root;
    // Legs.
    var leftLeg = BABYLON.MeshBuilder.CreateCylinder(
      "marioLeftLeg",
      { height: 1, diameter: 0.35 },
      scene
    );
    leftLeg.position = new BABYLON.Vector3(-0.25, 0.5, 0);
    var legMat = new BABYLON.StandardMaterial("marioLegMat", scene);
    legMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.8);
    leftLeg.material = legMat;
    leftLeg.parent = root;
    var rightLeg = leftLeg.clone("marioRightLeg");
    rightLeg.position.x = 0.25;
    rightLeg.parent = root;
    return root;
  }

  function createLink(scene) {
    var root = new BABYLON.TransformNode("LinkRoot", scene);
    var torso = BABYLON.MeshBuilder.CreateBox(
      "linkTorso",
      { width: 1, height: 1.5, depth: 0.6 },
      scene
    );
    torso.position.y = 0.75;
    var torsoMat = new BABYLON.StandardMaterial("linkTorsoMat", scene);
    torsoMat.diffuseColor = new BABYLON.Color3(0.1, 0.8, 0.1);
    torso.material = torsoMat;
    torso.parent = root;
    var head = BABYLON.MeshBuilder.CreateSphere(
      "linkHead",
      { diameter: 0.8 },
      scene
    );
    head.position.y = 1.6;
    var headMat = new BABYLON.StandardMaterial("linkHeadMat", scene);
    headMat.diffuseColor = new BABYLON.Color3(1, 0.87, 0.77);
    head.material = headMat;
    head.parent = root;
    var hat = BABYLON.MeshBuilder.CreateCylinder(
      "linkHat",
      { diameterTop: 0, diameterBottom: 0.8, height: 0.5 },
      scene
    );
    hat.rotation.z = Math.PI;
    hat.position.y = 2.05;
    var hatMat = new BABYLON.StandardMaterial("linkHatMat", scene);
    hatMat.diffuseColor = new BABYLON.Color3(0.1, 0.8, 0.1);
    hat.material = hatMat;
    hat.parent = root;
    var leftArm = BABYLON.MeshBuilder.CreateCylinder(
      "linkLeftArm",
      { height: 1, diameter: 0.3 },
      scene
    );
    leftArm.rotation.z = Math.PI / 2;
    leftArm.position = new BABYLON.Vector3(-0.75, 1.2, 0);
    var armMat = new BABYLON.StandardMaterial("linkArmMat", scene);
    armMat.diffuseColor = new BABYLON.Color3(1, 0.87, 0.77);
    leftArm.material = armMat;
    leftArm.parent = root;
    var rightArm = leftArm.clone("linkRightArm");
    rightArm.position.x = 0.75;
    rightArm.parent = root;
    var leftLeg = BABYLON.MeshBuilder.CreateCylinder(
      "linkLeftLeg",
      { height: 1, diameter: 0.35 },
      scene
    );
    leftLeg.position = new BABYLON.Vector3(-0.25, 0.5, 0);
    var legMat = new BABYLON.StandardMaterial("linkLegMat", scene);
    legMat.diffuseColor = new BABYLON.Color3(0.1, 0.8, 0.1);
    leftLeg.material = legMat;
    leftLeg.parent = root;
    var rightLeg = leftLeg.clone("linkRightLeg");
    rightLeg.position.x = 0.25;
    rightLeg.parent = root;
    return root;
  }

  function createKirby(scene) {
    var root = new BABYLON.TransformNode("KirbyRoot", scene);
    var body = BABYLON.MeshBuilder.CreateSphere(
      "kirbyBody",
      { diameter: 1.2 },
      scene
    );
    var bodyMat = new BABYLON.StandardMaterial("kirbyBodyMat", scene);
    bodyMat.diffuseColor = new BABYLON.Color3(1, 0.75, 0.8);
    body.material = bodyMat;
    body.parent = root;
    var leftEye = BABYLON.MeshBuilder.CreateSphere(
      "kirbyLeftEye",
      { diameter: 0.2 },
      scene
    );
    leftEye.position = new BABYLON.Vector3(-0.2, 0.1, -0.55);
    var eyeMat = new BABYLON.StandardMaterial("kirbyEyeMat", scene);
    eyeMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
    leftEye.material = eyeMat;
    leftEye.parent = root;
    var rightEye = leftEye.clone("kirbyRightEye");
    rightEye.position.x = 0.2;
    rightEye.parent = root;
    return root;
  }

  function createSamus(scene) {
    var root = new BABYLON.TransformNode("SamusRoot", scene);
    var torso = BABYLON.MeshBuilder.CreateBox(
      "samusTorso",
      { width: 1, height: 1.5, depth: 0.6 },
      scene
    );
    torso.position.y = 0.75;
    var torsoMat = new BABYLON.StandardMaterial("samusTorsoMat", scene);
    torsoMat.diffuseColor = new BABYLON.Color3(1, 0.8, 0);
    torso.material = torsoMat;
    torso.parent = root;
    var head = BABYLON.MeshBuilder.CreateSphere(
      "samusHead",
      { diameter: 0.8 },
      scene
    );
    head.position.y = 1.6;
    var headMat = new BABYLON.StandardMaterial("samusHeadMat", scene);
    headMat.diffuseColor = new BABYLON.Color3(1, 0.87, 0.77);
    head.material = headMat;
    head.parent = root;
    var visor = BABYLON.MeshBuilder.CreatePlane(
      "samusVisor",
      { width: 0.7, height: 0.35 },
      scene
    );
    visor.position = new BABYLON.Vector3(0, 1.6, -0.4);
    visor.rotation.x = -Math.PI / 8;
    var visorMat = new BABYLON.StandardMaterial("samusVisorMat", scene);
    visorMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 1);
    visorMat.alpha = 0.6;
    visor.material = visorMat;
    visor.parent = root;
    var leftArm = BABYLON.MeshBuilder.CreateCylinder(
      "samusLeftArm",
      { height: 1, diameter: 0.3 },
      scene
    );
    leftArm.rotation.z = Math.PI / 2;
    leftArm.position = new BABYLON.Vector3(-0.75, 1.2, 0);
    var armMat = new BABYLON.StandardMaterial("samusArmMat", scene);
    armMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    leftArm.material = armMat;
    leftArm.parent = root;
    var rightArm = leftArm.clone("samusRightArm");
    rightArm.position.x = 0.75;
    rightArm.parent = root;
    var leftLeg = BABYLON.MeshBuilder.CreateCylinder(
      "samusLeftLeg",
      { height: 1, diameter: 0.35 },
      scene
    );
    leftLeg.position = new BABYLON.Vector3(-0.25, 0.5, 0);
    var legMat = new BABYLON.StandardMaterial("samusLegMat", scene);
    legMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    leftLeg.material = legMat;
    leftLeg.parent = root;
    var rightLeg = leftLeg.clone("samusRightLeg");
    rightLeg.position.x = 0.25;
    rightLeg.parent = root;
    return root;
  }

  function createFox(scene) {
    var root = new BABYLON.TransformNode("FoxRoot", scene);
    var torso = BABYLON.MeshBuilder.CreateBox(
      "foxTorso",
      { width: 0.9, height: 1.4, depth: 0.5 },
      scene
    );
    torso.position.y = 0.7;
    var torsoMat = new BABYLON.StandardMaterial("foxTorsoMat", scene);
    torsoMat.diffuseColor = new BABYLON.Color3(1, 0.5, 0.1);
    torso.material = torsoMat;
    torso.parent = root;
    var head = BABYLON.MeshBuilder.CreateSphere(
      "foxHead",
      { diameter: 0.7 },
      scene
    );
    head.position.y = 1.4;
    var headMat = new BABYLON.StandardMaterial("foxHeadMat", scene);
    headMat.diffuseColor = new BABYLON.Color3(1, 0.87, 0.77);
    head.material = headMat;
    head.parent = root;
    var leftEar = BABYLON.MeshBuilder.CreateCylinder(
      "foxLeftEar",
      { diameterTop: 0, diameterBottom: 0.2, height: 0.3 },
      scene
    );
    leftEar.rotation.z = Math.PI;
    leftEar.position = new BABYLON.Vector3(-0.15, 1.75, 0);
    var earMat = new BABYLON.StandardMaterial("foxEarMat", scene);
    earMat.diffuseColor = new BABYLON.Color3(1, 0.5, 0.1);
    leftEar.material = earMat;
    leftEar.parent = root;
    var rightEar = leftEar.clone("foxRightEar");
    rightEar.position.x = 0.15;
    rightEar.parent = root;
    var leftArm = BABYLON.MeshBuilder.CreateCylinder(
      "foxLeftArm",
      { height: 0.8, diameter: 0.25 },
      scene
    );
    leftArm.rotation.z = Math.PI / 2;
    leftArm.position = new BABYLON.Vector3(-0.55, 1.1, 0);
    var armMat = new BABYLON.StandardMaterial("foxArmMat", scene);
    armMat.diffuseColor = new BABYLON.Color3(1, 0.4, 0.1);
    leftArm.material = armMat;
    leftArm.parent = root;
    var rightArm = leftArm.clone("foxRightArm");
    rightArm.position.x = 0.55;
    rightArm.parent = root;
    var leftLeg = BABYLON.MeshBuilder.CreateCylinder(
      "foxLeftLeg",
      { height: 1, diameter: 0.3 },
      scene
    );
    leftLeg.position = new BABYLON.Vector3(-0.25, 0.4, 0);
    var legMat = new BABYLON.StandardMaterial("foxLegMat", scene);
    legMat.diffuseColor = new BABYLON.Color3(1, 0.5, 0.1);
    leftLeg.material = legMat;
    leftLeg.parent = root;
    var rightLeg = leftLeg.clone("foxRightLeg");
    rightLeg.position.x = 0.25;
    rightLeg.parent = root;
    return root;
  }

  // ----------------- Character Selection UI Handling -----------------
  var charButtons = document.getElementsByClassName("charButton");
  for (var i = 0; i < charButtons.length; i++) {
    charButtons[i].addEventListener("click", function () {
      var choice = this.getAttribute("data-character");
      switch (choice) {
        case "mario":
          playerMesh = createMario(scene);
          break;
        case "link":
          playerMesh = createLink(scene);
          break;
        case "kirby":
          playerMesh = createKirby(scene);
          break;
        case "samus":
          playerMesh = createSamus(scene);
          break;
        case "fox":
          playerMesh = createFox(scene);
          break;
        default:
          playerMesh = createMario(scene);
      }
      playerMesh.position = new BABYLON.Vector3(0, 0, 0);
      scene.getCameraByName("FollowCam").lockedTarget = playerMesh;
      document.getElementById("introScreen").style.display = "none";
      document.getElementById("controls").style.display = "block";
    });
  }

  // ----------------- Shared Code Functions -----------------
  function generateGameCode(mesh) {
    var state = {
      x: mesh.position.x.toFixed(2),
      y: mesh.position.y.toFixed(2),
      z: mesh.position.z.toFixed(2)
    };
    return btoa(JSON.stringify(state));
  }

  function applyGameCode(code, mesh) {
    try {
      var decoded = JSON.parse(atob(code));
      mesh.position.x = parseFloat(decoded.x);
      mesh.position.y = parseFloat(decoded.y);
      mesh.position.z = parseFloat(decoded.z);
    } catch (e) {
      alert("Invalid game code!");
    }
  }

  // ----------------- Arena Generation with Optimizations -----------------
  function generateArena(scene) {
    // Create essential elements immediately:
    var arenaFloor = BABYLON.MeshBuilder.CreateGround(
      "arenaFloor",
      { width: 300, height: 300 },
      scene
    );
    var arenaFloorMat = new BABYLON.StandardMaterial("arenaFloorMat", scene);
    arenaFloorMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    arenaFloor.material = arenaFloorMat;
    arenaFloor.checkCollisions = true;

    var mainStage = BABYLON.MeshBuilder.CreateBox(
      "mainStage",
      { width: 120, depth: 120, height: 5 },
      scene
    );
    mainStage.position = new BABYLON.Vector3(0, 2.5, 0);
    var stageMat = new BABYLON.StandardMaterial("stageMat", scene);
    stageMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    mainStage.material = stageMat;
    mainStage.checkCollisions = true;

    // Delay loading of non-essential elements (platforms, pillars, skybox).
    setTimeout(function () {
      generateExtraArenaElements(scene);
    }, 500);
  }

  function generateExtraArenaElements(scene) {
    // Use instanced meshes for additional platforms.
    var masterPlat = BABYLON.MeshBuilder.CreateBox(
      "masterPlat",
      { width: 40, depth: 40, height: 3 },
      scene
    );
    var platMat = new BABYLON.StandardMaterial("platMat", scene);
    platMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    masterPlat.material = platMat;
    // Decorative platforms: disable collisions.
    masterPlat.checkCollisions = false;

    var platformPositions = [
      new BABYLON.Vector3(80, 10, 80),
      new BABYLON.Vector3(-80, 12, 80),
      new BABYLON.Vector3(80, 8, -80),
      new BABYLON.Vector3(-80, 15, -80)
    ];

    for (var i = 0; i < platformPositions.length; i++) {
      var platInst = masterPlat.createInstance("platform" + i);
      platInst.position = platformPositions[i];
      platInst.checkCollisions = false; // Set to true if needed.
    }

    // Use instanced meshes for decorative pillars.
    var masterPillar = BABYLON.MeshBuilder.CreateCylinder(
      "masterPillar",
      { height: 30, diameter: 5 },
      scene
    );
    var pillarMat = new BABYLON.StandardMaterial("pillarMat", scene);
    pillarMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    masterPillar.material = pillarMat;
    masterPillar.checkCollisions = false;

    var pillarPositions = [
      new BABYLON.Vector3(-120, 15, 0),
      new BABYLON.Vector3(120, 15, 0)
    ];

    for (var j = 0; j < pillarPositions.length; j++) {
      var pillarInst = masterPillar.createInstance("pillar" + j);
      pillarInst.position = pillarPositions[j];
      pillarInst.checkCollisions = false;
    }

    // Load the skybox asynchronously.
    createSkybox(scene);
  }

  // ----------------- Skybox with Asynchronous Texture Loading -----------------
  function createSkybox(scene) {
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000 }, scene);
    var skyboxMat = new BABYLON.StandardMaterial("skyBoxMat", scene);
    skyboxMat.backFaceCulling = false;
    skyboxMat.disableLighting = true;
    skyboxMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMat.specularColor = new BABYLON.Color3(0, 0, 0);
    // The reflection texture loads asynchronously.
    skyboxMat.reflectionTexture = new BABYLON.CubeTexture(
      "https://cdn.babylonjs.com/environments/skybox",
      scene,
      false,
      true,
      BABYLON.Texture.SKYBOX_MODE,
      function () {
        console.log("Skybox texture loaded asynchronously.");
      }
    );
    skyboxMat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = skyboxMat;
  }

  // ----------------- UI Event Listeners for Shared Functions -----------------
  document
    .getElementById("generateCodeBtn")
    .addEventListener("click", function () {
      var code = generateGameCode(playerMesh);
      document.getElementById("generatedCode").innerText =
        "Your Game Code: " + code;
    });
  document.getElementById("applyCodeBtn").addEventListener("click", function () {
    var code = document.getElementById("codeInput").value.trim();
    if (code) {
      applyGameCode(code, playerMesh);
    }
  });
  document
    .getElementById("generateArenaBtn")
    .addEventListener("click", function () {
      generateArena(scene);
      this.disabled = true;
    });

  // ----------------- Change the game title to Smash 3D -----------------
  document.title = "Smash 3D";
});
