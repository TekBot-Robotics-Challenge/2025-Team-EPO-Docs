# Création du README.md pour le test ROS2 (Test 2)
readme = """
# 🧪 ROS2 Test 2 – Sensor Data Evaluation

Ce projet est un exercice pratique pour découvrir les bases de ROS2 à travers la création d’un système Publisher/Subscriber.

## 📦 Objectif du projet

Créer un package ROS2 en Python nommé `sensor_data_evaluation` qui :
- Publie des données aléatoires de type `Float32` (entre 0.0 et 2.0) sur le topic `/sensor_data` toutes les 0.5 secondes.
- Souscrit à ce topic et affiche un message d’information ou d'alerte si la valeur est en dehors de l’intervalle [0.5 – 1.5].
- Lance les deux nœuds automatiquement via un fichier de lancement `.py`.

---

## 🧰 Prérequis

- ROS2 Humble installé
- Workspace `ros2_ws` initialisé (`src/`, `build/`, `install/`)
- Python 3.10 recommandé

---

## 🏗️ Installation et compilation

```bash
cd ~/ros2_ws/src
ros2 pkg create --build-type ament_python --dependencies rclpy std_msgs sensor_data_evaluation
# Ajouter le code (voir ci-dessous)
cd ~/ros2_ws
colcon build --packages-select sensor_data_evaluation
source install/setup.bash
```

📁 Arborescence du projet
text
Copy
Edit
sensor_data_evaluation/
├── launch/
│   └── sensor_data_launch.py
├── sensor_data_evaluation/
│   ├── __init__.py
│   ├── publisher_node.py
│   └── subscriber_node.py
├── package.xml
├── setup.py
🚀 Lancement
```bash

ros2 launch sensor_data_evaluation sensor_data_launch.py
```
Vous pouvez aussi lancer les scripts manuellement pour test :

```bash
ros2 run sensor_data_evaluation publisher_node
ros2 run sensor_data_evaluation subscriber_node
```
