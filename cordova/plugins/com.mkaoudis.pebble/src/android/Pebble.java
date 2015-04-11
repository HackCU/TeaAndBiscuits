package com.mkaoudis.pebble;

import org.apache.cordova.*;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.*;
import android.util.*;

import com.getpebble.android.kit.*;
import com.getpebble.android.kit.util.*;

import java.util.*;

public class Pebble extends CordovaPlugin {
    public static final String TAG = "PebblePlugin";

	@Override
	public boolean execute(String action, JSONArray args, final CallbackContext cb) throws JSONException {

		Context context=this.cordova.getActivity().getApplicationContext();

		//check for a connected pebble
		if (action.equals("isWatchConnected")){
            cb.success(PebbleKit.isWatchConnected(context) ? 1 : 0);
            return true;
        }

        if(action.equals("alert")){

        	final Intent i = new Intent("com.getpebble.action.SEND_NOTIFICATION");

        	final Map data = new HashMap();
        	data.put("title", args.getString(1));
        	data.put("body", args.getString(2));
        	final JSONObject jsonData = new JSONObject(data);
        	final String notificationData = new JSONArray().put(jsonData).toString();

        	i.putExtra("messageType", "PEBBLE_ALERT");
        	i.putExtra("sender", "MyAndroidApp");
        	i.putExtra("notificationData", notificationData);

        	Log.d(TAG, "About to send an alert to Pebble: " + notificationData);
        	context.sendBroadcast(i);
        	cb.success();
        	return true;
        }

        //if no action found
        return false;
	}
}