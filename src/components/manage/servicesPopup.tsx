import { ServiceType } from "src/types/service";

const ServicesPopup = () => {
  let emptyBasicService = {
    name: "",
    description: "",
    estimated_time: 0,
    total_price: 0,
    parts: [],
    type: ServiceType.CANNED,
  };

  let emptyCustomService = {
    name: "",
    description: "",
    estimated_time: 0,
    total_price: 0,
    parts_condition_new: false,
    parts_condition_used: false,
    parts_type_oem: false,
    parts_type_aftermarket: false,
    type: ServiceType.CUSTOM,
  };

  const openNewBasicService = () => {
    // setProduct(emptyBasicService);
    // setSubmitted(false);
    // setProductDialog(true);
  };
};

export default ServicesPopup;
