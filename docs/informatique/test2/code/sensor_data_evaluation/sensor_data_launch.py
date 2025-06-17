# launch/sensor_data_launch.py
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(package='sensor_data_evaluation',
             executable='publisher_node',
             name='sensor_publisher',
             output='screen'),
        Node(package='sensor_data_evaluation',
             executable='subscriber_node',
             name='sensor_subscriber',
             output='screen'),
    ])
