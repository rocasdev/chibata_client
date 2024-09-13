import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "lqo4sa4m",
  dataset: "production",
  apiVersion: "2022-03-07",
  token: "skNtsjZVNcSMPLv69KCAgFheXJeplw3EtrTJUieVkssF0cN5yTeE22nwf5dSzDQsEpX3lfftLzGP3D1oEghZ3pI9XcSmpwgGAOHHkwbQ9FQ9QyUqdN5hki7GOrxLxi6rS4sRPqR7ZhDM6yiNzBPoyJW0wsoWx6RtUVZqVuq7TmdG4iG3E1w2",
  useCdn: false,
});
