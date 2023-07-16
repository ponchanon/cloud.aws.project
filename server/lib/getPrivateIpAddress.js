const getPrivateIpAddress = () => {
    const networkInterfaces = os.networkInterfaces();

    for (const interfaceName in networkInterfaces) {
        const networkInterface = networkInterfaces[interfaceName];

        for (const network of networkInterface) {
            if (!network.internal && network.family === 'IPv4') {
                return network.address;
            }
        }
    }

    return null; // Return null if no private IP address is found
};

module.exports = getPrivateIpAddress;