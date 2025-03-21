# DEMO STEPS

## (Introduction)

- Aurora, web dev, norway, consultant at Crayon Consulting in oslo
- Excited to speak here today, because i'll be teaching you how to elevate speed, interactivity and user experience with React Server Components.
- I will be coding something inspired by a feature i’ve built for my current consultancy project, where im actively using React Server Components.

## Setup and starting point

- This is a project task manager demo app. The very talented designer (smile) of my current project Eileen Røsholt has designed the UI, and it's inspired by a feature we made in that project.
- The setup is the Next.js App Router, Prisma ORM and an Prisma Postgres DB, Tailwind CSS.
- Demo app, new tab: Very slow load, slowed down data fetches on purpose.
- But, it's actually not bad. Try out tabs, try search with a basic form, see the result in the table.
- The App Router is server first, and this is all server components, which means there is no js shipped to the client for these components. Just html, links and a form, which means things work without js.
- We start with web standards first, good base case, will work even if we are on a device with low processing power that cannot run JS efficiently.

## Review lighthouse scores

- Open pre-run lighthouse screen. Show impact of each by hovering circle.
- FCP: Bad since we are showing nothing until all server components are done.
- LCP: Bad, out LCP is shown same time as our FCP.
- Speed index bad since it measures incrementally how much content is shown, but we have nothing until everything is shown.
- TBT: 0 since no JS, responsive page, no uncanny valley since default elements.
- CLS: 0 since everything is painted at once.
- Overall metrics are bad but actually not the worst because we have no js to get high TBT and no moving elements to get high CLS.
- However the app feels terrible on initial load because we are waiting for everything to render on the server and only getting the default browser spinner.

## Go through the code

- Async layout.tsx server component
- Show the different data files just querying a db, been made dynamic with connection() and slowed with slow().
- Mention each component in the file, search and form, children:
- Dynamic route [tab], async page.tsx server components, we are querying our db based on filters directly based on the filters inside this server component.
- Dynamic requests, static is easy because this could be run in the build, but this is dynamic data. We have to await at reqeust time.
- Basically, want we want to do is elevate the speed, interactivity and UX of this app, and improve the web vitals that are bad without worsening the good ones.

## Improve the UX when switching tabs

- Lets improve the UX of these tabs.
- Tabs are navigating but very slowly, because we are waiting for the await for the table data in page.tsx to finish.
- Suspense will allow us to mark a server component as non-urgent, and show a fallback while waiting for finish, and then stream it in.
- Let's unblock the page.tsx by adding loading.tsx inside /[tab] to create an implicit suspense boundary. Now it can navigate instantly. Go to "todo" tab.

## Improve data fetching in layout.tsx

- For the initial load, I'm blocked by the awaits in the layout and I cant show anything on the screen.
- Layout.tsx fetches are running sequentially even though they don't depend on each other.
- The first thought might be to run them in parallel with promise.all(). Right? That would help, but you would still be blocked in the layout.
- So, let's push the data fetches down from the layout to the components themselves.
- Move projectDetails fetch to projectDetails.tsx, and move tabs fetch to tabs.tsx. Each component is now responsible for their own data, colocating data and UI, making them composable.
- Display suspense fallbacks with "loading..." around projectDetails, and around tabs. - Show the result: streaming in the RSCs using just a little js as they complete on the server. Running in parallel, have a lower total load time. We can actually show something on the screen and even interact with what we have (fill search).
- However, did you see how the elements are visually unstable as they load? We got cumulative layout shift. Uncomfortable UX. Open CWV: CLS is no longer 0, and is very impactful on our scores.
- We have to make loading fallbacks the right size. Replace with skeletons.
- Open CWV: Showcase the improved CLS. Managed 0-0.1 since my skeletons are good, but this can be hard to obtain with dynamically sized content.
- We also fixed the FCP and LCP since we are showing the project information right away and not blocking the page, and LCP is our FCP which is the project information and its very fast. (Our LCP is still slowed down but greatly improved).

## Improve UX

Let's continue to improve the UX, it is still not good here.

### Mark active tab and read promise with use in Tabs.tsx

- Let's start by showing the currently active tab. Add useParams and get active tab. Make client component. We cannot have this async now, and we cant access db anyway here, we have to fetch the data outside. Put the data outside.
- But we don't want to get back to blocking our layout. Lets remove the await and pass it down to the Tabs as a promise.
- Then we can read the promise with use() which will resolve it, and the component will suspend the same way allowing us to see the fallback.
- Now we can see the active tabs and navigate between them.

### Add a loading spinner to Search.tsx

- Open Search.tsx. Using the default form submit, which is a GET pushing the values of the inputs inside the form to the URL. Uncomfortable default experience which we often prevent with preventDefault. Full page and cant see active search.
- Progressive enhancement of the base case search. Let's first use the new Nextjs 15 form component to make this a client side navigation when js is loaded: import, use form and add action, current route with empty string.
- (Since this is a form, we can head over to the SearchStatus.tsx and useFormStatus to get the submitting status. Enable the spinner.)
- We can also add an onChange handler, we want to push to the router. Add router and searchParams.
- We are gonna use the existing search params because we will keeping the state in the URL as a single source of truth, because the state of the app will be reloadable, shareable, and bookmarkable.
- Add q and defaultvalue.
- Add activetab (and params) to reset with a key.
- Add "use client".
- Notice the url is updating later because we are waiting for the await in the table to resolve before routing.
- As a user, we want to know that something is happening in the app.
- Explain useTransition: mark a state update as non-urgent and non-blocking and get pending state.
- Wrap with startTransition, use pending state to display feedback while waiting for the navigation to finish, which is the await in the table component.
- While we are transitioning, we can see the spinner.
- When this is hydrated by js, we have the progressive enhancement of the client side nav, onchange and the spinner.
- (Using a transition also batches the key strokes, leaving only one entry in the history.)

## Add CategoryFilter.tsx to layout.tsx

- Add the CategoryFilter component to layout.tsx. It takes in a categories promise and reads it with use. Pass it down with a new data fetch and suspend with correct skeleton, demo load.
- This component is filtering with searchParams again, using the URL as the state again. However when we click the tabs, we don't see anything happening.
- Pay attention to the URL. It's not updating until the new table in page.tsx is done with its await query and finished rendering on the server. Therefore we cannot see the active filters right away.
- Let's mark the loading state, another transition. Add startTransition around router.push. How can we use this isPending? Not a lot of options, not suitable for a spinner.
- Add the pending to data-pending.
- Show class group in layout, show pseudo-class group-has data-pending in page.tsx.
- Show the result. Instead of showing nothing i.e using a suspense, we can show stale content and indicate that it's stale.
- Instead of creating a global state manager, we can just use css. Add data-pending=isPending attribute.
- But i also want responsive buttons, and were gonna use useOptimistic - it is a great tool to handle this. It will take in a state to show when no transition is pending, which is our "truth" of the url, and return an optimistic value and a trigger function.
- Add useOptimistic to CategoryFilter.tsx. Set them inside the transition while waiting for the router to resolve. Showcase.
- UseOptimistic will create a optimistic state on the client, but then throw away it away after the transition completes. The categories are instant and don't depend in the network.
- (Credit to Sam Selikoff with his post on buildui blog for this pattern).
- (Batching again, only updating once we are done selecting, leaving only one entry in the history.)

## Cache() getCategoriesMap in categories.ts

- UX is good now. Let's consider the data fetching in the layout.
- We are fetching the categories twice for every render - once for the task summary and once for the category filter. Show terminal logs 2x. We can reuse the the return value of getCategoriesMap.
- Add cache() React 19 function to getCategoriesMap in categories.ts. This enables per-render caching. Pay attention to the load time, refresh.
- The load time is actually reduced by 500ms because the StatusTabs and the CategoryFilter are using the same return value of getCategoriesMap. And you can see it's only run once. Show terminal logs 1x.
- Instead of passing the data down from a common parent (hoisting), the components all call the same cached data. This means that can keep using our pattern of fetching data inside the components themselves, maintaining composition.

## Turn on staleTimes in next.config.js

- Enable more caching.
- Every time we click a tab, filter, or search, we are rerunning the page.tsx table on the server, with the data fetch. We can resuse this, my data doesnt need to be that fresh. In the future, we will be able to use the new "use cache" directive in Next.js for more granular control, but it's not ready yet.
- Enable staleTimes in next.config.js. This will cache the rsc payload on the client for the route page.tsx, the table. Refresh page.
- Show the result. Click the same twice. Now we dont have to regenerate the server component every time.

## Final demo

- From "todo": see content right away, and interact with tabs while streaming in the server components as they finish rendering on the server. And we have some nice caching here.
- Reload, even filter before the streaming is complete, enable "testing" and "backend".
- Search for "api", spinner. Disable "testing" filter, see that my content is stale. Reload/share/bookmark the page and have the same state.
- Greatly improved UX. Even though the data fetches are still extremely slow, the app feels super responsive.
- And this is very robust: progressively enhanced the no-js base case, and just added a low amount of js, using it only where needed and partially hydrating the app. (No race conditions because of useTransitions batching.)
- No useEffects or useStates in sight. We are making interactive apps without that in this new world of React Server Components.

## Improve Speed Index with Partial Pre-rendering

- We can still improve the speed. Show project details in layout. Actually, we are dynamically fetching this project info data on every page load even though it very rarely changes.
- This could be static data that we can revalidate on a time based interval using for example fetch options, or, the new Next.js directive "use cache" and its related APIs. Wasting resources and time. Static is the fastest.
- (Remove the suspense around the projectDetails). Remove all connection() from the data fetches. Dynamic by default. Suspense Search because SearchParams with skeleton because SearchParams opt into dynamic rendering.
- (Show the result: We are getting errors in the application! These will continue to improve. Without dynamicIO, you would not be notified of this, and espeically new Next.js devs did not know why their navigations felt slow or how to start debugging it. If you didn't do it right from the start, it would be very hard to debug and improve later.)
- Add "use cache" and cacheLife("hours"). Can also revalidate with cacheTag in server actions or API endpoints, if for example I were to update a project. (The error is now gone).
- I also want to use Partial Prerendering. This will allow me to partially the layout as static, and prerender all the cached data in the app. Prevously determined by suspense boundaries, now PPR is determined by your cache boundaries.
- Turn on partial prerendering in next.config.js. Also turn on CSS inlining for even more speed. I need to make a production build, I've already deployed it so we can see it.
- Open the second tab in new window.
- Copy paste new tab: the app is now instantly showing useful content. This can be extremely impactful on a bigger application with larger or slower chunks of static content.
- Reload, its just there right away because its static.

## Review lighthouse scores again

- Open the third tab in new window with pre-run scores. Hover scores.
- Again, the LCP and FCP are much improved since the first run because they are both the project information, but we can also see that the speed index improved since we show start off with more content, the project information, before showing incrementally more content, as seen in filmstrip.
- We can also maintained the TBT of 0, which corresponds to the responsive clicks because we have minimal JS and no long tasks.
- Maintained 0 CLS because of these skeletons being sized correctly.
- We have greatly improved performance, getting 99 score in lighthouse even with a 2.3s second total load time application.
- We managed to complete our task of improving the bad metrics and maintaining the good ones, while also making app fast, interactive and user-friendly.

## (Note on nuqs)

- (Demo clicking two params quickly, and show that the first update is discarded. This is because the updates are in seperate transitions. We would have to refactor this a little bit to make it work properly).
- I want to show you an improvement I've made. It's a version using a library called nuqs. Switch branch to nuqs. Reload.
- Nuqs is a type-safe search param manager for React.
- In Search.tsx: using the same transition implementation, and using shallow:false to make the search param trigger a page reload. Show also CategoryFilter.tsx.
- The way nuqs is implemented, it actually manipulates the URL instantly. No need to implement our own useOptimistic logic.
- We can click lots of filters quickly and across the app without any problem.
- For the real world, we would want to use a library to achieve the search param filtering. It will be less code, and a more robust implementation that avoids certain race conditions. So thats why I'm showing you this.

## (Conclusion)

That's it for this talk, the code is pinned on my github, and follow me on twitter if you are interested in more RSC content. Thanks for listening!
