import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.176.0/examples/jsm/controls/OrbitControls.js';

class App {
    #camera_ = null;
    #clock_ = null;
    #controls_ = null
    #mesh_ = null;
    #scene_ = null;
    #threejs_ = null;

    constructor() {
    }

    async _initialize() {
        this.#clock_ = new THREE.Clock();

        window.addEventListener("resize", () => {
            this.#onWindowResize_();
        }, false);

        await this.#setUpProject_();
        
        this.#onWindowResize_();
        this.#requestAnimationFrame_();
    }

    #createScene() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        const cube = new THREE.Mesh(geometry, material);

        this.#scene_.add(cube);
    }

    #onWindowResize_() {
        const canvas = this.#threejs_.domElement;
        // const dpr = THREE.MathUtils.clamp(window.devicePixelRatio, 1, 2);
        const dpr = window.devicePixelRatio
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspect = width / height;
        console.log(`Resizing to ${width} x ${height}`);

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        this.#threejs_.setSize(width * dpr, height * dpr, false);

        // this.#threejs_.setPixelRatio(dpr);

        // DPR = 2 | 2x2 -> 4 pixels per screen pixel
        // 4x the work might equal to poor performance.

        // iPhones have a DPR of 3.
        // DPR = 3 | 3x3 -> 9 pixels per screen pixel

        // Could always clamp.
        // DPR = clamp(dpr, 1, 2)

        this.#camera_.aspect = aspect;
        this.#camera_.updateProjectionMatrix();
    }

    #render_() {
        this.#threejs_.render(this.#scene_, this.#camera_);
    }

    #requestAnimationFrame_() {
        requestAnimationFrame(() => {
            const deltaTime = this.#clock_.getDelta();

            this.#step_(deltaTime);
            this.#render_();
            this.#requestAnimationFrame_();
        });
    }

    async #setUpProject_() {
        this.#threejs_ = new THREE.WebGLRenderer(
            {
                canvas: document.getElementById("threejs"),
            }
        );
        this.#threejs_.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.#threejs_.domElement);

        const fov = 60;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 1000;
        this.#camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.#camera_.position.set(0, 1, 3);

        this.#controls_ = new OrbitControls(this.#camera_, this.#threejs_.domElement);
        this.#controls_.enableDamping = true;
        this.#controls_.target.set(0, 0, 0);
        this.#controls_.update();

        this.#scene_ = new THREE.Scene();
        this.#scene_.background = new THREE.Color(0x000000);
        
        this.#createScene();
    }

    #step_(timeElapsed) {
        
    }
};

const APP_ = new App();

window.addEventListener("DOMContentLoaded", async () => {
    await APP_._initialize();
});