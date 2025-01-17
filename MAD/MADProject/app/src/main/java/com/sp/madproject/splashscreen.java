package com.sp.madproject;

import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;

public class splashscreen extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splashscreen);

        View outerCircle = findViewById(R.id.outer_circle);
        View middleCircle = findViewById(R.id.middle_circle);
        View innerCircle = findViewById(R.id.inner_circle);

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

        // Animator sets to sequence the animations
        // Animator set for the outer circle
        AnimatorSet outerAnimatorSet = new AnimatorSet();
        outerAnimatorSet.playTogether(outerScaleX, outerScaleY);

        // Animator set for the middle circle
        AnimatorSet middleAnimatorSet = new AnimatorSet();
        middleAnimatorSet.playTogether(middleScaleX, middleScaleY);

        // Animator set for the inner circle
        AnimatorSet innerAnimatorSet = new AnimatorSet();
        innerAnimatorSet.playTogether(innerScaleX, innerScaleY);

        // Main animator set to play animations sequentially
        AnimatorSet animatorSet = new AnimatorSet();
        animatorSet.playSequentially(outerAnimatorSet, middleAnimatorSet, innerAnimatorSet);

        // Start the animation
        animatorSet.start();

    }
}
