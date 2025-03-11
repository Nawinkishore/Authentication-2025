import Bill from "../model/Bill.model.js";

export const generateBill = async (req, res) => {
    const { fromAddress, toAddress, invoiceNumber, invoiceDate, details } = req.body;
    console.log('Received request:', req.body);
    
    try {
        const bill = new Bill({
            fromAddress,
            toAddress,
            invoiceNumber,
            invoiceDate,
            details
        });
        await bill.save();
        res.status(201).json({ message: "Bill generated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const getBills = async (req, res) => {
    try {
        const bills = await Bill.find();
        res.status(200).json(bills);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getBillById = async (req, res) => {
    const { id } = req.params;
    try {
        const bill = await Bill.findById(id);
        res.status(200).json(bill);
    }catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateBill = async (req, res) => {
        const { id } = req.params;
        try {
            const { fromAddress, toAddress, invoiceNumber, invoiceDate, details } = req.body;
            const bill = await Bill.findById(id);
            if (!bill) {
                return res.status(404).json({ message: "Bill not found" });
            }
    
            bill.fromAddress = fromAddress;
            bill.toAddress = toAddress;
            bill.invoiceNumber = invoiceNumber;
            bill.invoiceDate = invoiceDate;
            bill.details = details;
    
            const updatedBill = await bill.save();
            res.status(200).json(updatedBill);
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
        }
}

export const deleteBillbyId = async (req, res) => {
    const { id } = req.params;
    try {
        await Bill.findByIdAndDelete(id);
        res.status(200).json({ message: "Bill deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};