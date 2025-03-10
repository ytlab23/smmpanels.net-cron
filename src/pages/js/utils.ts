export function isAdminLoggedIn(param_cookie: any) {
    if (param_cookie == undefined || param_cookie == "")
        return false
    else
        return true;
}

export function formatDate(inputDate: string) {
    const date = new Date(inputDate);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
}

export function removeHTMLTags(str: string) {
    // Regular expression to match HTML tags
    const regex = /<\/?[^>]+(>|$)/g;
    // Replace matched HTML tags with an empty string
    return str.replace(regex, "");
}

export function timeDifference(dateTime: string | Date): string {
    const inputTime = new Date(dateTime);
    const currentTime = new Date();

    const diffInMs = currentTime.getTime() - inputTime.getTime();
    const diffInMin = Math.floor(diffInMs / 1000 / 60);
    const diffInHours = Math.floor(diffInMin / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 6) {
        return "NA";
    }

    if (diffInDays > 0) {
        return diffInDays === 1 ? "1 Day" : `${diffInDays} Days`;
    }

    if (diffInHours > 0) {
        const remainingMinutes = diffInMin % 60;
        return remainingMinutes > 0
            ? `${diffInHours} Hr${diffInHours > 1 ? 's' : ''}, ${remainingMinutes} Min`
            : `${diffInHours} Hr${diffInHours > 1 ? 's' : ''}`;
    }

    return `${diffInMin} Min`;
}

export function getAPIPath() {
    let siteIs = "https://smmpanels-admin.vercel.app/";
    // let siteIs = "http://localhost:4321/";
    return siteIs
}

type Service = {
  panelName?: string;
  panelRefUrl?: string;
  panelSlug: string;
  serviceCategory?: string;
  serviceMax?: number;
  serviceMin?: number;
  serviceName: string;
  serviceNo: number;
  serviceRate?: number;
  serviceUploadDate?: string;
};

export function compareServices(oldArray: Service[], newArray: Service[]): { newlyAdded: Service[], toBeDeleted: Service[] } {
  let newlyAdded : Service[] = [];
  let toBeDeleted : Service[] = [];
  try {
    // Create a Set of existing services from oldArray based on serviceNo, serviceName, panelSlug
    const oldSet = new Set(oldArray.map(s => `${s.serviceNo}-${s.serviceName}-${s.panelSlug}`));

    // Create a Set of new services for quick lookup
    const newSet = new Set(newArray.map(s => `${s.serviceNo}-${s.serviceName}-${s.panelSlug}`));

    // Find newly added services
    newlyAdded = newArray.filter(s => !oldSet.has(`${s.serviceNo}-${s.serviceName}-${s.panelSlug}`));

    // Find services that need to be deleted
    toBeDeleted = oldArray.filter(s => !newSet.has(`${s.serviceNo}-${s.serviceName}-${s.panelSlug}`));

    return { newlyAdded, toBeDeleted };
  } catch (error) {
    console.log(error);
    return { newlyAdded, toBeDeleted };
  }
}

// Example usage:
//   console.log(timeDifference('2024-07-01T10:00:00')); // Adjust the date and time as needed
