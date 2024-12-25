import { properties } from "@/consts/property-example"
import { DashboardPropertyGrid } from "../property-grid"

const PropertyListing = () => {
   return (
      <div className="space-y-6">
         <DashboardPropertyGrid data={properties}/>
      </div>
   )
}

export default PropertyListing
