const Contract = require('../models/Contract');

exports.createContract = async (req, res) => {
    try {
        const nuevoContrato = new Contract({
            ...req.body,
            createdBy: req.user.id
        });
        await nuevoContrato.save();
        res.status(201).json(nuevoContrato);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear contrato', error: error.message });
    }
};

exports.getContracts = async (req, res) => {
    try {
        const contracts = await Contract.find()
            .populate('cliente', 'nombreComercial email')
            .populate('asset', 'nombre ipPrincipal')
            .populate('tipoServicio status periodoPago', 'nombre');
            
        res.json(contracts);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener contratos', error });
    }
};
