import { Alert } from "../partials";
import { IoHandRight } from "react-icons/io5"
import { useTranslation } from "react-i18next"

const AdBlock = () => {
    const { t } = useTranslation();

    <Alert 
        title={t("common.alerts.adblockdetected")}
        text={t("common.alerts.disableadblock")}
        icon={<IoHandRight className="text-neutral" />  }
        color="warning"
    /> 
}

export default AdBlock