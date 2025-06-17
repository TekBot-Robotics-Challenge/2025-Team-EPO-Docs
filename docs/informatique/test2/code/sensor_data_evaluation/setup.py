from setuptools import setup

package_name = 'sensor_data_evaluation'

setup(
    name=package_name,
    version='0.0.1',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
         ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
        ('share/' + package_name + '/launch', ['launch/sensor_data_launch.py']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='ton_nom',
    maintainer_email='ton_mail@example.com',
    description='Package ROS2 pour publier et valider des données capteurs',
    license='MIT',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'publisher_node = sensor_data_evaluation.publisher_node:main',
            'subscriber_node = sensor_data_evaluation.subscriber_node:main',
        ],
    },
)

