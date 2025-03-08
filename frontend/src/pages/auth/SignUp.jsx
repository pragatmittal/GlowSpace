import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertTriangle, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Inline SVG component for the mascot
  const SignUpMascot = () => (
    <svg width="319" height="318" viewBox="0 0 319 318" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="9" width="300" height="300" rx="150" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M294.404 198.448C282.38 212.779 251.017 206.263 224.359 183.896C197.701 161.514 198.276 142.206 210.314 127.86C222.338 113.53 241.25 109.6 267.923 131.967C294.566 154.349 306.427 184.118 294.404 198.448Z" fill="#7D944D"/>
<path d="M285.286 169.816C280.786 169.816 276.464 167.911 273.41 164.498L254.423 143.268C251.797 140.328 250.352 136.546 250.352 132.602V122.334C250.352 121.226 251.251 120.34 252.343 120.34C253.45 120.34 254.335 121.241 254.335 122.334V132.602C254.335 135.557 255.412 138.393 257.389 140.594L276.375 161.824C279.031 164.779 282.955 166.241 286.879 165.709L294.255 164.719C295.347 164.587 296.35 165.34 296.498 166.433C296.645 167.526 295.878 168.531 294.786 168.679L287.41 169.669C286.717 169.757 285.994 169.816 285.286 169.816Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M152.52 255.704C241.493 255.704 260.951 199.786 249.282 141.062C237.613 82.337 197.294 28 152.52 28C107.746 28 66.8963 78.6288 55.7729 141.062C44.6495 203.509 63.5475 255.704 152.52 255.704Z" fill="#9BB168"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M150.763 60.0156H173.114C196.408 60.0156 215.291 78.9257 215.291 102.253C215.291 125.58 196.408 144.491 173.114 144.491H150.763C127.469 144.491 108.586 125.58 108.586 102.253C108.586 78.911 127.469 60.0156 150.763 60.0156Z" fill="#7D944D"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M156.002 56.3359H178.352C201.646 56.3359 220.529 75.246 220.529 98.5734C220.529 121.901 201.646 140.811 178.352 140.811H156.002C132.707 140.811 113.824 121.901 113.824 98.5734C113.824 75.246 132.707 56.3359 156.002 56.3359Z" fill="white"/>
<path d="M137.206 256.131C136.1 256.131 135.215 255.23 135.215 254.136V231.932C135.215 223.127 142.37 215.947 151.177 215.947H182.025C188.619 215.947 193.989 210.569 193.989 203.966V197.908C193.989 196.8 194.889 195.914 195.981 195.914C197.087 195.914 197.972 196.815 197.972 197.908V203.966C197.972 212.771 190.817 219.951 182.01 219.951H151.177C144.583 219.951 139.213 225.328 139.213 231.932V254.122C139.213 255.23 138.313 256.131 137.206 256.131Z" fill="#7D944D"/>
<path d="M195.98 155.659C194.873 155.659 193.988 154.758 193.988 153.665V152.276C193.988 146.765 198.458 142.289 203.961 142.289H248.278C249.384 142.289 250.269 143.19 250.269 144.283C250.269 145.392 249.369 146.278 248.278 146.278H203.961C200.656 146.278 197.971 148.967 197.971 152.276V153.665C197.971 154.773 197.086 155.659 195.98 155.659Z" fill="#7D944D"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M176.439 154.979L202.757 154.52C214.48 154.314 224.15 163.656 224.365 175.39C224.365 175.39 224.365 175.39 224.362 175.405C224.562 187.136 215.233 196.822 203.509 197.028L177.192 197.487C165.468 197.693 155.798 188.351 155.584 176.617C155.584 176.617 155.584 176.617 155.586 176.602C155.389 164.856 164.718 155.17 176.439 154.979Z" fill="#926247"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M182.711 154.496L208.516 154.051C220.375 153.839 230.173 163.309 230.379 175.176L230.376 175.191C230.58 187.073 221.126 196.872 209.254 197.067L183.449 197.511C171.59 197.723 161.804 188.27 161.583 176.4L161.586 176.386C161.382 164.504 170.837 154.705 182.711 154.496Z" fill="white"/>
<path d="M183.334 186.583C177.97 186.58 173.545 182.258 173.446 176.856C173.342 171.394 177.704 166.872 183.161 166.772L183.326 166.772C183.387 166.767 183.445 166.778 183.505 166.773C188.869 166.777 193.294 171.099 193.394 176.5C193.498 181.962 189.136 186.485 183.679 186.584L183.514 186.585C183.456 186.575 183.395 186.579 183.334 186.583ZM183.239 170.76C179.978 170.813 177.375 173.517 177.433 176.767C177.488 180.031 180.18 182.621 183.441 182.568L183.606 182.567C186.853 182.512 189.456 179.808 189.398 176.558C189.342 173.294 186.627 170.67 183.39 170.757L183.239 170.76Z" fill="#926247"/>
<path d="M199.803 173.346C198.741 173.338 197.853 172.506 197.817 171.435C197.771 170.333 198.623 169.404 199.725 169.359L214.866 168.708C215.968 168.663 216.897 169.517 216.943 170.619C216.988 171.722 216.136 172.651 215.034 172.696L199.893 173.347C199.864 173.341 199.835 173.336 199.803 173.346Z" fill="#926247"/>
<path d="M200.379 181.476C199.317 181.468 198.429 180.636 198.393 179.565C198.347 178.463 199.2 177.534 200.301 177.489L209.042 177.115C210.143 177.07 211.072 177.924 211.118 179.027C211.164 180.129 210.311 181.058 209.21 181.103L200.469 181.476C200.437 181.486 200.408 181.481 200.379 181.476Z" fill="#926247"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M165.597 82.0352C168.193 82.0352 170.303 84.1478 170.303 86.7479V88.3434C170.303 90.9436 168.193 93.0562 165.597 93.0562C163 93.0562 160.891 90.9436 160.891 88.3434V86.7479C160.891 84.1478 163 82.0352 165.597 82.0352Z" fill="#926247"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M198.968 82.0352C201.564 82.0352 203.674 84.1478 203.674 86.7479V88.3434C203.674 90.9436 201.564 93.0562 198.968 93.0562C196.371 93.0562 194.262 90.9436 194.262 88.3434V86.7479C194.262 84.1478 196.371 82.0352 198.968 82.0352Z" fill="#926247"/>
<path d="M178.448 113.992C173.078 113.992 168.711 109.619 168.711 104.241C168.711 103.133 169.611 102.247 170.703 102.247C171.809 102.247 172.694 103.148 172.694 104.241C172.694 107.418 175.276 110.003 178.448 110.003L187.373 109.929C190.559 109.9 193.126 107.373 193.215 104.182C193.244 103.074 194.174 102.217 195.266 102.247C196.372 102.276 197.228 103.192 197.198 104.3C197.051 109.648 192.743 113.874 187.402 113.933L178.448 113.992Z" fill="#4F3422"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M43.5359 217.736C59.7194 227.087 86.9084 210.245 104.287 180.108C121.665 149.97 114.525 132.035 98.3416 122.668C82.1581 113.331 63.0683 116.109 45.6898 146.247C28.3113 176.385 27.3523 208.384 43.5359 217.736Z" fill="#7D944D"/>
<path d="M82.0557 208.428C81.259 208.428 80.4919 207.941 80.1969 207.143L74.4581 192.222C73.2927 189.193 73.5582 185.854 75.1957 183.047L87.1305 162.468C89.0336 159.203 92.5595 157.164 96.3361 157.164H112.077C113.184 157.164 114.069 158.065 114.069 159.158C114.069 160.252 113.169 161.153 112.077 161.153H96.3214C93.961 161.153 91.7628 162.423 90.5679 164.462L78.6331 185.042C77.6152 186.8 77.4529 188.883 78.1758 190.774L83.9145 205.725C84.3128 206.759 83.7965 207.911 82.7638 208.31C82.5278 208.384 82.2917 208.428 82.0557 208.428Z" fill="white"/>
<path d="M232.746 317.931C249.823 317.931 263.667 304.067 263.667 286.965C263.667 269.864 249.823 256 232.746 256C215.668 256 201.824 269.864 201.824 286.965C201.824 304.067 215.668 317.931 232.746 317.931Z" fill="#ED7E1C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M218.638 270H246.755C248.309 270 249.569 271.257 249.569 272.809V276.08C249.569 277.632 248.309 278.889 246.755 278.889H218.638C217.084 278.889 215.824 277.632 215.824 276.08V272.809C215.824 271.257 217.084 270 218.638 270Z" fill="#4F3422"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M219.871 278.891H245.867V301.812C245.867 303.364 244.608 304.621 243.053 304.621H222.685C221.13 304.621 219.871 303.364 219.871 301.812V278.891Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M224.729 283.098H242.064C242.835 283.098 243.464 283.726 243.464 284.496V293.385C243.464 294.154 242.835 294.783 242.064 294.783H224.729C223.958 294.783 223.328 294.154 223.328 293.385V284.496C223.328 283.726 223.958 283.098 224.729 283.098Z" fill="white"/>
<path d="M240.151 289.96H228.701C227.93 289.96 227.301 289.332 227.301 288.562C227.301 287.793 227.93 287.164 228.701 287.164H240.151C240.922 287.164 241.552 287.793 241.552 288.562C241.564 289.332 240.935 289.96 240.151 289.96Z" fill="#4F3422"/>
<path d="M65.5941 74.6848C77.6695 62.5922 77.6695 42.9862 65.5941 30.8937C53.5187 18.8011 33.9406 18.8011 21.8652 30.8937C9.78974 42.9862 9.78974 62.5922 21.8652 74.6848C33.9406 86.7773 53.5187 86.7773 65.5941 74.6848Z" fill="#ED7E1C"/>
<path d="M46.9906 58.5703H41.5469V68.7049H46.9906V58.5703Z" fill="#4F3422"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M27.9877 34.9609H60.5613C61.6678 34.9609 62.5529 35.8621 62.5529 36.9554V57.8894C62.5529 58.9975 61.653 59.8839 60.5613 59.8839H27.9877C26.8812 59.8839 25.9961 58.9827 25.9961 57.8894V36.9554C25.9961 35.8621 26.8812 34.9609 27.9877 34.9609Z" fill="white"/>
<path d="M54.2016 70.9029H34.9642C33.8578 70.9029 32.9727 70.0017 32.9727 68.9085C32.9727 67.8152 33.8726 66.9141 34.9642 66.9141H54.2016C55.308 66.9141 56.1932 67.8152 56.1932 68.9085C56.1932 70.0017 55.308 70.9029 54.2016 70.9029Z" fill="#4F3422"/>
<path d="M34.1823 54.3596C33.666 54.3596 33.1644 54.1676 32.7661 53.7687C31.9842 52.9857 31.9842 51.7299 32.7661 50.9469L40.1719 43.5306C40.9538 42.7476 42.2077 42.7476 42.9896 43.5306L46.6187 47.1649L52.7853 40.9896C53.5672 40.2066 54.8212 40.2066 55.603 40.9896C56.3849 41.7726 56.3849 43.0283 55.603 43.8113L48.0202 51.4049C47.2383 52.1879 45.9844 52.1879 45.2025 51.4049L41.5881 47.7854L35.5986 53.7834C35.215 54.1676 34.6987 54.3596 34.1823 54.3596Z" fill="#4F3422"/>
<path d="M309.594 102.685C321.67 90.5922 321.67 70.9862 309.594 58.8937C297.519 46.8011 277.941 46.8011 265.865 58.8937C253.79 70.9862 253.79 90.5922 265.865 102.685C277.941 114.777 297.519 114.777 309.594 102.685Z" fill="#ED7E1C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M279.343 90.9714C275.242 86.9382 273.649 82.1812 274.534 76.7297C275.862 68.5452 284.477 64.9848 290.983 67.0383C297.489 69.0918 300.218 72.8295 301 78.4878C301.516 82.2698 299.908 86.4212 296.146 90.9714L294.774 93.2613V97.6195C294.774 101.475 291.662 104.593 287.811 104.593C283.961 104.593 280.848 101.475 280.848 97.6195V93.7636L279.343 90.9714Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M285.85 82.4461H282.855C282.486 82.4461 282.191 82.1506 282.191 81.7813C282.191 81.6483 282.236 81.5153 282.309 81.4119L287.576 73.7002C287.783 73.3899 288.196 73.316 288.505 73.5229C288.683 73.6411 288.801 73.8479 288.801 74.0695V77.6594C288.801 78.0288 289.096 78.3243 289.464 78.3243H291.972C292.341 78.3243 292.636 78.6197 292.636 78.9891C292.636 79.122 292.607 79.2402 292.533 79.3436L287.753 86.9225C287.561 87.2327 287.148 87.3213 286.838 87.1293C286.647 87.0111 286.529 86.7895 286.529 86.5679V83.1256C286.514 82.7563 286.219 82.4461 285.85 82.4461Z" fill="#4F3422"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M304.128 76.6857L307.108 76.1686C307.92 76.0209 308.702 76.5675 308.834 77.3801C308.982 78.1926 308.436 78.9608 307.625 79.1086L304.645 79.6257C303.833 79.7734 303.051 79.2268 302.919 78.4142C302.771 77.6017 303.317 76.8335 304.128 76.6857Z" fill="#4F3422"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M299.259 66.0031L301.029 63.595C301.516 62.9302 302.46 62.7677 303.139 63.2552C303.803 63.7427 303.95 64.6735 303.478 65.3383C303.478 65.3383 303.478 65.3383 303.478 65.3531L301.708 67.7611C301.221 68.426 300.277 68.5885 299.598 68.1009C298.934 67.6134 298.772 66.6827 299.259 66.0031C299.259 66.0179 299.259 66.0179 299.259 66.0031Z" fill="#4F3422"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M286.469 62.2213V59.828C286.469 58.8234 287.28 57.9961 288.298 57.9961C289.316 57.9961 290.127 58.8086 290.127 59.828V62.2213C290.127 63.2259 289.316 64.0532 288.298 64.0532C287.28 64.0532 286.469 63.2259 286.469 62.2213Z" fill="#4F3422"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M273.28 67.3043L271.155 65.1917C270.565 64.6155 270.565 63.67 271.141 63.0791C271.141 63.0791 271.141 63.0791 271.155 63.0643C271.745 62.4734 272.69 62.4734 273.28 63.0643L275.404 65.1769C275.994 65.7531 275.994 66.6986 275.419 67.2895C275.419 67.2895 275.419 67.2895 275.404 67.3043C274.814 67.8805 273.87 67.8805 273.28 67.3043Z" fill="#4F3422"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M270.388 78.2649L267.363 77.999C266.537 77.9251 265.932 77.2012 266.006 76.3887C266.08 75.5614 266.803 74.9557 267.629 75.0295L270.653 75.2954C271.479 75.3693 272.084 76.0932 272.01 76.9058C271.937 77.7331 271.214 78.3388 270.388 78.2649Z" fill="#4F3422"/>
<path d="M293.167 95.3448C293.152 95.3448 293.152 95.3448 293.167 95.3448L282.5 95.2857C281.394 95.2857 280.509 94.3845 280.524 93.2765C280.524 92.1833 281.424 91.2969 282.515 91.2969C282.515 91.2969 282.515 91.2969 282.53 91.2969L293.181 91.356C294.288 91.356 295.173 92.2572 295.158 93.3652C295.143 94.4584 294.258 95.3448 293.167 95.3448Z" fill="#4F3422"/>
<path d="M290.731 102.54H284.874C283.768 102.54 282.883 101.638 282.883 100.545C282.883 99.452 283.783 98.5508 284.874 98.5508H290.731C291.838 98.5508 292.723 99.452 292.723 100.545C292.723 101.638 291.823 102.54 290.731 102.54Z" fill="#4F3422"/>
<path d="M244.035 24.7811C241.122 26.4629 237.335 26.1587 234.718 23.7801C234.536 23.6122 234.328 23.4592 234.123 23.3391C233.258 22.8148 232.237 22.6704 231.254 22.9141C230.27 23.1579 229.448 23.7692 228.925 24.634L228.751 24.9222C228.618 25.1352 228.486 25.3482 228.333 25.5558C226.961 27.457 224.933 28.6957 222.616 29.0783C220.304 29.4408 217.977 28.891 216.088 27.5079L215.14 26.81C214.967 26.6879 214.789 26.586 214.611 26.4841C213.669 26.0041 212.6 25.9221 211.602 26.2594C210.597 26.5838 209.793 27.2866 209.315 28.2282C209.114 28.6173 208.885 28.9882 208.641 29.3335C207.396 31.0419 205.566 32.1498 203.483 32.4655C201.399 32.7813 199.319 32.2764 197.61 31.0281L194.546 28.7886C193.66 28.1399 193.465 26.8877 194.112 26.0023C194.76 25.1169 196.011 24.9234 196.896 25.5721L199.961 27.8116C200.799 28.4367 201.832 28.6929 202.86 28.5259C203.896 28.3717 204.801 27.815 205.424 26.9773C205.546 26.8047 205.66 26.6192 205.755 26.4284C206.704 24.5325 208.345 23.1248 210.355 22.476C212.37 21.807 214.517 21.9837 216.412 22.9363C216.774 23.1199 217.145 23.3493 217.49 23.5935L218.451 24.284C219.482 25.0366 220.743 25.3322 222.007 25.1313C223.27 24.9304 224.373 24.2429 225.123 23.2124C225.196 23.1022 225.281 22.9847 225.354 22.8745L225.528 22.5862C226.597 20.8089 228.286 19.544 230.312 19.0398C232.325 18.543 234.426 18.8482 236.203 19.9203C236.642 20.1787 237.057 20.4848 237.429 20.8333C239.045 22.3053 241.55 22.1895 243.019 20.5737C243.161 20.4064 243.303 20.2392 243.43 20.0464L245.321 17.0954C245.913 16.1736 247.153 15.9014 248.075 16.495C248.997 17.0886 249.283 18.3222 248.678 19.2514L246.788 22.2023C246.546 22.5806 246.277 22.9407 245.973 23.2697C245.368 23.8747 244.725 24.3828 244.035 24.7811Z" fill="#FFCE5C"/>
<path d="M9.63341 132.294C4.3225 132.294 0 127.966 0 122.647C0 117.329 4.3225 113 9.63341 113C14.9443 113 19.2668 117.329 19.2668 122.647C19.2816 127.951 14.9443 132.294 9.63341 132.294ZM9.63341 116.974C6.52063 116.974 3.98319 119.515 3.98319 122.632C3.98319 125.75 6.52063 128.291 9.63341 128.291C12.7462 128.291 15.2836 125.75 15.2836 122.632C15.2836 119.515 12.7462 116.974 9.63341 116.974Z" fill="#C2B1FF"/>
<path d="M31.1736 285.965C30.5983 285.965 30.0377 285.728 29.6394 285.256C28.9313 284.413 29.0345 283.143 29.8902 282.449L61.0918 256.226C62.6261 254.94 63.5555 253.138 63.7325 251.144C63.9095 249.149 63.2899 247.214 62.0065 245.677C60.723 244.141 58.9232 243.21 56.9316 243.033C54.94 242.856 53.0074 243.476 51.4731 244.761L20.2715 270.984C19.4306 271.694 18.1766 271.59 17.4685 270.733C16.7604 269.891 16.8637 268.621 17.7193 267.926L48.921 241.688C51.2666 239.724 54.2319 238.778 57.2856 239.044C60.3394 239.31 63.0982 240.758 65.0602 243.092C67.0223 245.441 67.9665 248.41 67.7009 251.469C67.4354 254.527 65.9897 257.289 63.644 259.254L32.4424 285.492C32.0735 285.817 31.6162 285.965 31.1736 285.965Z" fill="#7D944D"/>
<path d="M155.964 311.642C149.37 311.642 144 306.117 144 299.321C144 292.525 149.37 287 155.964 287C157.071 287 157.956 287.901 157.956 288.994C157.956 290.102 157.056 290.989 155.964 290.989C151.568 290.989 147.983 294.727 147.983 299.306C147.983 303.901 151.568 307.624 155.964 307.624C157.071 307.624 157.956 308.525 157.956 309.618C157.956 310.711 157.071 311.642 155.964 311.642Z" fill="#FFCE5C"/>
</svg>

  );

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate on change
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "email":
        if (!value) {
          newErrors.email = "Email cannot be empty!";
        } else if (!validateEmail(value)) {
          newErrors.email = "Invalid Email Address!!";
        } else {
          delete newErrors.email;
        }
        break;
      case "password":
        if (!value) {
          newErrors.password = "Password cannot be empty!";
        } else {
          delete newErrors.password;
        }
        // Check confirmation match whenever password changes
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match!";
        } else if (formData.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;
      case "confirmPassword":
        if (!value) {
          newErrors.confirmPassword = "Please confirm your password!";
        } else if (value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match!";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
      confirmPassword: true
    });
    
    // Validate all fields
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email cannot be empty!";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid Email Address!!";
    }
    
    if (!formData.password) {
      newErrors.password = "Password cannot be empty!";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password!";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }
    
    setErrors(newErrors);
    
    // If no errors, proceed with sign up
    if (Object.keys(newErrors).length === 0) {
      // Redirect to home page after successful signup
      navigate("/");
    }
  };

  const isFormValid = () => {
    return (
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      Object.keys(errors).length === 0
    );
  };

  const ErrorMessage = ({ message }) => (
    <div className="flex items-center mt-2 text-sm text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
      <AlertTriangle className="h-4 w-4 mr-1" />
      <span>{message}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-lg">
        {/* Left section - Illustration Space */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-orange-50 to-amber-100 p-6 flex items-center justify-center">
          <div className="text-center">
            {/* Inline SVG mascot */}
            <div className="w-64 h-64 mx-auto mb-6 flex items-center justify-center">
              <SignUpMascot />
            </div>
            <h2 className="text-2xl font-bold text-amber-800">Join our community</h2>
            <p className="text-amber-700 mt-2">Create an account and get started today</p>
          </div>
        </div>

        {/* Right section - Sign Up Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-brown text-center mb-10">Create Account</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-brown font-medium text-lg">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-brown" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-12 pr-4 py-4 border ${
                    touched.email && errors.email ? "border-orange-400" : "border-[#E8E4D8]"
                  } rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  placeholder="Enter your email..."
                />
              </div>
              {touched.email && errors.email && <ErrorMessage message={errors.email} />}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-brown font-medium text-lg">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-brown" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-12 pr-12 py-4 border ${
                    touched.password && errors.password ? "border-orange-400" : "border-[#E8E4D8]"
                  } rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  placeholder="Enter your password..."
                />
                <div 
                  className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              {touched.password && errors.password && <ErrorMessage message={errors.password} />}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-brown font-medium text-lg">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-brown" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-12 pr-12 py-4 border ${
                    touched.confirmPassword && errors.confirmPassword ? "border-orange-400" : "border-[#E8E4D8]"
                  } rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  placeholder="Confirm your password..."
                />
                <div 
                  className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              {touched.confirmPassword && errors.confirmPassword && <ErrorMessage message={errors.confirmPassword} />}
            </div>

            <button 
              type="submit" 
              className={`w-full text-white rounded-full py-4 border flex items-center justify-center mt-8 text-lg font-medium transition-all ${
                isFormValid() 
                  ? "bg-[#553C2E] border-[#553C2E] hover:bg-[#46321F] cursor-pointer" 
                  : "bg-[#8a7a70] border-[#8a7a70] cursor-not-allowed opacity-70"
              }`}
              disabled={!isFormValid()}
            >
              <span className="mr-2">Sign Up</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            {/* Sign In Link */}
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/auth/sign-in" className="text-amber-800 font-medium hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 