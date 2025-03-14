import Bill from "../model/Bill.model.js";

export const generateBill = async (req, res) => {
    const { fromAddress, toAddress, invoiceDate, details } = req.body;
  
    // console.log("Received request:", req.body);
  
    try {
      const bill = new Bill({
        fromAddress,
        toAddress,
        invoiceDate: new Date(invoiceDate),  // Convert string to Date object
        details,
      });
  
      await bill.save();
      res.status(201).json({ message: "Bill generated successfully", bill });
    } catch (error) {
        console.error(" Detailed Error Object:", JSON.stringify(error, null, 2));
        res.status(500).json({ 
          message: "Server Error", 
          error: error.message 
        });
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
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateBill = async (req, res) => {
  const { id } = req.params;
  try {
    const { fromAddress, toAddress, invoiceNumber, invoiceDate, details } =
      req.body;

    const bill = await Bill.findById(id);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    bill.fromAddress = fromAddress ?? bill.fromAddress;
    bill.toAddress = toAddress ?? bill.toAddress;
    bill.invoiceNumber = invoiceNumber ?? bill.invoiceNumber;
    bill.invoiceDate = invoiceDate ?? bill.invoiceDate;

    if (details && Array.isArray(details)) {
      details.forEach((newDetail) => {
        const existingDetail = bill.details.find(
          (detail) => detail.serialNumber === newDetail.serialNumber
        );

        if (existingDetail) {
          Object.keys(newDetail).forEach((key) => {
            if (newDetail[key] !== undefined && newDetail[key] !== null) {
              existingDetail[key] = newDetail[key];
            }
          });
        } else {
          bill.details.push(newDetail);
        }
      });
    }

    const updatedBill = await bill.save();
    res.status(200).json(updatedBill);
  } catch (error) {
    console.error("Error updating bill:", error); 
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteBillbyId = async (req, res) => {
  const { id } = req.params;
  try {
    const bill = await Bill.findById(id);
    if (!bill) {
        return res.status(404).json({ message: "Bill not found" });
    }
    await Bill.findByIdAndRemove(id);
    res.status(200).json({ message: "Bill deleted successfully" });
  } catch (error) {
    console.error("Error deleting bill:", error); 
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};