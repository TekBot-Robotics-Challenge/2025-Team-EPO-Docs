# sensor_data_evaluation/subscriber_node.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
import json

class SensorSubscriber(Node):
    def __init__(self):
        super().__init__('sensor_subscriber')
        self.subscription = self.create_subscription(String, '/sensor_data', self.listener_callback, 10)
        self.get_logger().info("Subscriber node started...")

    def listener_callback(self, msg):
        try:
            data = json.loads(msg.data)
            alerts = []

            if not (15 <= data["temperature"] <= 35):
                alerts.append(f"Température hors plage : {data['temperature']}°C")
            if not (30 <= data["humidity"] <= 70):
                alerts.append(f"Humidité hors plage : {data['humidity']}%")
            if not (950 <= data["pressure"] <= 1050):
                alerts.append(f"Pression hors plage : {data['pressure']} hPa")

            if alerts:
                self.get_logger().warn(" | ".join(alerts))
            else:
                self.get_logger().info("Toutes les données sont normales ✅")

        except json.JSONDecodeError:
            self.get_logger().error("Erreur de décodage JSON")

def main(args=None):
    rclpy.init(args=args)
    node = SensorSubscriber()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

