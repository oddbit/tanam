// import axios from "axios";
// import {getFunctions, TaskOptions} from "firebase-admin/functions";
// import {logger} from "firebase-functions/v2";
// import {TanamConfig} from "../config";

// // Allow `any` in this type since that's the type defined in Firebase Task Queue
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type TaskQueuePayload = Record<string, any>;

// /**
//  * Firebase task queue utility class that wraps functionality for transparently
//  * working in both cloud and local emulator.
//  *
//  * Abstracts the task queue function to transparently support running in
//  * emulator. The task queue functions are exposed as HTTP functions.
//  *
//  * @see https://firebase.google.com/docs/functions/task-functions#testing_task_queue_functions_using_the
//  *
//  * N.B
//  * YOU SHOULD DECLARE YOUR TASK QUEUE FUNCTIONS AS V1 FUNCTIONS
//  * OTHERWISE THE URL TO THE FUNCTION IS HARD TO GET
//  *
//  * READ THIS FOR COMPLICATIONS WITH V2 FUNCTIONS AND THEIR URLS
//  * @see https://firebase.google.com/docs/functions/beta/task-functions#retrieve_and_include_the_target_uri
//  */
// export class TaskQueueUtility {
//   /**
//    * Constructor
//    *
//    * @param {string} functionName Name of v1 function to call. Avoid using v2.
//    */
//   constructor(functionName: string) {
//     this.functionName = functionName;
//   }

//   private readonly functionName: string;

//   /**
//    * Enqueue a task
//    *
//    * @param {TaskQueuePayload} payload
//    * @param {TaskOptions} [options] Optional options
//    */
//   async enqueue(payload: TaskQueuePayload, options?: TaskOptions): Promise<void> {
//     if (TanamConfig.isEmulated) {
//       // The URL should look like
//       // http://localhost:$PORT/$PROJECT_ID/$REGION/$FUNCTION_NAME
//       const url = [
//         "http://127.0.0.1:5001",
//         TanamConfig.projectId,
//         TanamConfig.cloudFunctionRegion,
//         this.functionName,
//       ].join("/");
//       logger.debug("Running in emulator. Calling HTTP endpoint: " + url);
//       await axios.post(url, payload);
//       return;
//     }

//     // Modify the function name to include the region when
//     // not using default region `us-central1`
//     // @see  https://stackoverflow.com/questions/74982023/error-queue-does-not-exist-when-queue-ing-task-in-firebase-functions
//     // eslint-disable-next-line max-len
//     const functionNameWithRegion = `locations/${TanamConfig.cloudFunctionRegion}/functions/${this.functionName}`;

//     logger.debug("Running in cloud. Calling real queue " + this.functionName, {
//       functionNameWithRegion,
//       payload,
//       options,
//     });

//     return getFunctions().taskQueue(functionNameWithRegion).enqueue(payload, options);
//   }
// }
