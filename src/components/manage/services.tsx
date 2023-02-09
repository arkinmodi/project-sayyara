import { readShopServices } from "@redux/actions/shopActions";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import { ShopSelectors } from "@redux/selectors/shopSelector";
import { TabPanel, TabView } from "primereact/tabview";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IService, ServiceType } from "src/types/service";
import ServicesTable from "./servicesTable";

const Services = () => {
  const [customServices, setCustomServices] = useState<IService[]>([]);
  const [basicServices, setBasicServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const serviceList = useSelector(ShopSelectors.getShopServices);
  const dispatch = useDispatch();
  const shopId = useSelector(AuthSelectors.getShopId);

  /**
   * If we refresh the page, the session may not be loaded yet.
   * If shopId value changes, we want to retrieve the services again.
   */
  useEffect(() => {
    dispatch(readShopServices());
  }, [dispatch, shopId]);

  useEffect(() => {
    if (serviceList != null) {
      let custom: IService[] = [];
      let basic: IService[] = [];

      serviceList.forEach((service: IService) => {
        if (service.type === ServiceType.CANNED) {
          basic.push(service);
        } else {
          custom.push(service);
        }
      });

      setCustomServices(custom);
      setBasicServices(basic);
      setLoading(false);
    }
  }, [serviceList]);

  return (
    <div>
      <TabView>
        <TabPanel header="Basic">
          <ServicesTable
            serviceType={ServiceType.CANNED}
            services={basicServices}
            isLoading={loading}
          />
        </TabPanel>
        <TabPanel header="Custom">
          <ServicesTable
            serviceType={ServiceType.CUSTOM}
            services={customServices}
            isLoading={loading}
          />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default React.memo(Services);
