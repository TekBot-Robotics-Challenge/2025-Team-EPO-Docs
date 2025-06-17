# sensor_data_evaluation/publisher_node.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
import random
import json

class SensorPublisher(Node):
    def __init__(self):
        super().__init__('sensor_publisher')
        self.publisher_ = self.create_publisher(String, '/sensor_data', 10)
        self.timer = self.create_timer(0.5, self.publish_data)
        self.get_logger().info("Publisher node started...")

    def publish_data(self):
        data = {
            "temperature": round(random.uniform(15, 35), 2),
            "humidity": round(random.uniform(30, 70), 2),
            "pressure": round(random.uniform(950, 1050), 2),
        }
        msg = String()
        msg.data = json.dumps(data)
        self.publisher_.publish(msg)
        self.get_logger().info(f"Publishing: {msg.data}")

def main(args=None):
    rclpy.init(args=args)
    node = SensorPublisher()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

