package com.sp.madproject4;

import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;

import androidx.appcompat.app.AppCompatActivity;

import com.sp.madproject4.home;

public class splashscreen extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splashscreen);

        View outerCircle = findViewById(R.id.outer_circle);
        View middleCircle = findViewById(R.id.middle_circle);
        View innerCircle = findViewById(R.id.ActiveTrack);
        View weightingicon = findViewById(R.id.weightingicon);
        View armicon = findViewById(R.id.armicon);
        View dumbellicon = findViewById(R.id.dumbellicon);
        View manicon = findViewById(R.id.manicon);
        View treadmillicon = findViewById(R.id.treadmillicon);
        View hearticon = findViewById(R.id.hearticon);

        // Animation for the outer circle
        ObjectAnimator outerScaleX = ObjectAnimator.ofFloat(outerCircle, "scaleX", 1f, 1.5f);
        ObjectAnimator outerScaleY = ObjectAnimator.ofFloat(outerCircle, "scaleY", 1f, 1.5f);
        outerScaleX.setDuration(1000);
        outerScaleY.setDuration(1000);

        // Animation for the middle circle
        ObjectAnimator middleScaleX = ObjectAnimator.ofFloat(middleCircle, "scaleX", 1f, 1.5f);
        ObjectAnimator middleScaleY = ObjectAnimator.ofFloat(middleCircle, "scaleY", 1f, 1.5f);
        middleScaleX.setDuration(1000);
        middleScaleY.setDuration(1000);

        // Animation for the inner circle
        ObjectAnimator innerScaleX = ObjectAnimator.ofFloat(innerCircle, "scaleX", 1f, 1.5f);
        ObjectAnimator innerScaleY = ObjectAnimator.ofFloat(innerCircle, "scaleY", 1f, 1.5f);
        innerScaleX.setDuration(1000);
        innerScaleY.setDuration(1000);

        // Load animations for icons
        Animation weightingiconAnimation = AnimationUtils.loadAnimation(this, R.anim.translate_weightingicon);
        Animation armiconAnimation = AnimationUtils.loadAnimation(this, R.anim.translate_armicon);
        Animation dumbelliconAnimation = AnimationUtils.loadAnimation(this, R.anim.translate_dumbellicon);
        Animation maniconAnimation = AnimationUtils.loadAnimation(this, R.anim.translate_manicon);
        Animation treadmilliconAnimation = AnimationUtils.loadAnimation(this, R.anim.translate_treadmillicon);
        Animation hearticonAnimation = AnimationUtils.loadAnimation(this, R.anim.translate_hearticon);

        // Play all animations together
        AnimatorSet animatorSet = new AnimatorSet();
        animatorSet.playTogether(
                outerScaleX, outerScaleY,
                middleScaleX, middleScaleY,
                innerScaleX, innerScaleY
        );

        weightingicon.startAnimation(weightingiconAnimation);
        armicon.startAnimation(armiconAnimation);
        dumbellicon.startAnimation(dumbelliconAnimation);
        manicon.startAnimation(maniconAnimation);
        treadmillicon.startAnimation(treadmilliconAnimation);
        hearticon.startAnimation(hearticonAnimation);

        // Start the circle scaling animations
        animatorSet.start();

        // Transition to another page after 3 seconds
        new Handler().postDelayed(() -> {
            Intent intent = new Intent(splashscreen.this, home.class); // Replace with your next activity
            startActivity(intent);
            finish(); // Close the current splashscreen activity
        }, 3000); // 3000 milliseconds = 3 seconds
    }
}
