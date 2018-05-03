helpers = {
    calibrate: function(){
       cam.offset_yaw   = -cam.raw_yaw;
       cam.offset_roll  = -cam.raw_roll;
       cam.offset_pitch = -cam.raw_pitch;
    }
}
