'use client';

import { useState, useEffect } from 'react';

type UserSkin = { weapon_type: string, skin_id: string };
type Weapon = { id: string, name: string, image: string, category: { name: string } };
type Skin = { id: string, name: string, image: string, paint_index: string, weapon: { name: string }, rarity: { name: string, color: string }, isCustom?: boolean };

// Category SVG icons as inline components
const KnifeIcon = ({ fill }: { fill: string }) => (
    <svg width="48" height="18" viewBox="0 0 62 18" fill={fill} xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M16.5358 10.5463C16.3682 10.5587 16.1736 10.6369 15.9553 10.7786C15.7489 10.9074 15.543 11.0756 15.3366 11.2815C15.156 11.4615 15.0278 11.6482 14.949 11.8423C14.8989 11.9841 14.841 12.2355 14.7763 12.5966C14.724 12.8925 14.724 13.1501 14.7763 13.3695C14.8016 13.4989 14.8793 13.7177 15.0092 14.0265C15.111 14.2971 15.3231 14.5485 15.6459 14.7814C15.9823 15.0255 16.3299 15.1864 16.6905 15.2651C17.0387 15.3287 17.3925 15.2966 17.7531 15.1672C18.0894 15.0384 18.3718 14.8573 18.6041 14.625C18.8629 14.3685 19.0429 14.1097 19.1453 13.8533C19.2352 13.5821 19.2797 13.2463 19.2797 12.8469C19.2797 12.4481 19.1717 12.0741 18.9518 11.7253C18.7583 11.3906 18.4821 11.0947 18.1198 10.8366C17.8628 10.6566 17.5663 10.5536 17.2311 10.5272C17.1023 10.5142 16.8711 10.521 16.5358 10.5463ZM49.0748 12.0932C49.3577 12.8014 49.5247 13.3813 49.5759 13.8341C49.2418 13.3048 48.7586 12.7192 48.1258 12.0741C46.8377 10.7978 45.432 9.86344 43.9121 9.27056C42.5194 8.74181 41.3859 8.40713 40.509 8.26481C40.1614 8.21419 39.8002 8.18212 39.4262 8.16862C39.2586 8.16862 38.9295 8.16862 38.4407 8.16862C37.2673 8.19506 36.0816 8.36888 34.8823 8.69119C34.4964 8.79413 34.1353 8.90325 33.8012 9.01969L33.4131 9.17437L33.4524 9.30994C33.4648 9.4005 33.4468 9.47025 33.3939 9.52256C33.3163 9.57319 33.1296 9.66375 32.8326 9.792C32.5361 9.90844 32.3511 9.96638 32.2729 9.96638C32.1952 9.95344 32.1306 9.88931 32.0799 9.77287C32.0659 9.74756 32.0214 9.63731 31.9438 9.44381C31.8403 9.135 31.6474 8.81381 31.3633 8.478C30.9122 7.93688 30.4093 7.63425 29.8558 7.57013C29.0824 7.46663 28.4057 7.71863 27.8257 8.32331C27.6446 8.50388 27.4843 8.71031 27.3431 8.9415L27.1879 9.252C27.0208 9.14906 26.7958 9.07762 26.5112 9.03937C25.9436 8.94825 25.3896 9.02588 24.8473 9.27113C24.3973 9.477 24.0036 9.80606 23.67 10.2566C23.5524 10.3978 23.4568 10.5418 23.3797 10.6824L23.2819 10.8557C23.0754 10.8304 22.8442 10.8112 22.5866 10.7977C22.0708 10.7859 21.6844 10.8557 21.4262 11.0104C21.168 11.1656 20.9301 11.4159 20.7112 11.7647C20.646 11.8676 20.5751 11.9897 20.4975 12.132C20.4469 12.2479 20.4142 12.3244 20.4013 12.3637C20.3507 12.4414 20.3051 12.4734 20.2669 12.4605L20.2089 12.4222V12.7316C20.2089 12.9763 20.1881 13.1957 20.1504 13.3886C20.0992 13.6215 19.9502 13.9376 19.7061 14.337C19.4732 14.7223 19.2859 14.9811 19.1441 15.1099C18.9388 15.3158 18.6609 15.4969 18.3127 15.651C17.8358 15.8839 17.3655 15.993 16.9014 15.9795C16.4751 15.9677 15.8963 15.768 15.1611 15.3804C14.9423 15.2511 14.7156 15.1166 14.4844 14.9754L14.2133 14.7819L13.0157 14.5108L12.9375 14.3167C13.0551 14.1497 13.1844 13.9438 13.3262 13.698C13.6091 13.2092 13.7891 12.7958 13.8668 12.4605C13.9568 12.1388 14.0805 11.7124 14.2352 11.1847L14.4293 10.5081L14.8343 10.2943L14.6216 10.0642C14.6604 9.90788 14.7049 9.75375 14.7578 9.59906C14.886 9.30206 14.9889 9.14119 15.0666 9.11531C15.1301 9.1035 15.2139 9.1035 15.3169 9.11531C15.4069 9.11531 15.4789 9.09619 15.5306 9.05794C15.6589 8.99269 15.723 8.92181 15.723 8.84419C15.6966 8.76712 15.6904 8.71594 15.7039 8.69063C15.7427 8.60006 15.8136 8.55394 15.9171 8.55394C15.9294 8.55394 16.0009 8.57306 16.1291 8.61412C16.2321 8.65181 16.2956 8.64506 16.3215 8.59331C16.3485 8.568 16.3794 8.47069 16.4188 8.30306C16.4582 8.16075 16.5094 8.07019 16.5735 8.03194C16.6764 7.95431 16.7991 7.95431 16.9402 8.03194C17.0044 8.08369 17.0573 8.10956 17.0955 8.10956C17.1461 8.12194 17.199 8.10956 17.2508 8.07019C17.3284 8.00663 17.3666 7.90987 17.3666 7.78162C17.3526 7.67756 17.4049 7.58812 17.5208 7.5105C17.6377 7.44581 17.7469 7.43344 17.8498 7.47169C17.8628 7.47169 17.901 7.48462 17.9663 7.5105C17.9916 7.53581 18.0118 7.54256 18.0242 7.52962C18.0754 7.50431 18.1007 7.44581 18.1007 7.35525C18.0889 7.25119 18.1007 7.17469 18.1406 7.1235C18.2689 6.99412 18.3926 6.93675 18.5079 6.94913C18.5856 6.94913 18.63 6.94913 18.6424 6.94913C18.6947 6.94913 18.7459 6.93 18.7976 6.89062C18.8364 6.83944 18.882 6.7815 18.9326 6.71681C18.945 6.69094 18.9709 6.65212 19.0097 6.60206C19.0226 6.57619 19.1132 6.52331 19.2791 6.44625C19.3584 6.408 19.4349 6.36919 19.512 6.33094L19.5503 6.19481L20.4598 5.6925C21.1826 5.29313 21.8706 4.95787 22.5293 4.68731C23.1733 4.41619 24.0637 4.13325 25.1966 3.83569C25.7636 3.68156 26.2738 3.55781 26.7238 3.46894L27.3037 3.7395L27.5737 3.66188L27.8449 3.681C28.0648 3.70631 28.2831 3.72544 28.5019 3.7395C29.2112 3.76481 29.8102 3.72544 30.3019 3.6225C31.0612 3.45544 31.6868 3.20344 32.1761 2.86988C32.4214 2.70169 32.5958 2.54644 32.6992 2.40469L33.8974 2.25L34.11 2.52112L34.1291 2.73319L36.8741 2.94637C37.8675 3.08756 38.6859 3.24956 39.3306 3.43012C40.0652 3.64838 40.8499 3.94537 41.6891 4.31944C42.4626 4.66594 43.074 5.00231 43.5251 5.32406C44.0156 5.65931 44.5179 6.039 45.0349 6.46425C45.6266 6.98006 46.1227 7.46944 46.5216 7.9335C47.6561 9.27675 48.5066 10.6633 49.0748 12.0932Z" />
    </svg>
);

const GloveIcon = ({ fill }: { fill: string }) => (
    <svg width="48" height="18" viewBox="0 0 63 18" fill={fill} xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.5" d="M30.8369 0.762266C31.183 0.626402 31.6816 1.01422 31.6816 1.01422H32.3311L32.7207 1.34918L35.4033 2.58356L35.6748 2.83551L37.9902 3.36969H39.2559L40.3926 4.14215L41.5068 4.41656L42.5127 6.02789L43.5303 6.87555C43.5303 6.87555 43.0542 7.56695 42.3613 7.56695C41.6687 7.56678 40.2339 6.33814 39.9922 6.23785C40.3403 6.60783 41.4131 7.39327 41.4209 7.39898L42.5127 8.06891L44.0596 9.315C44.0838 9.33587 45.2538 10.3459 45.6611 10.8843C46.0719 11.4289 45.8125 12.2085 45.5439 12.4029C45.2419 12.6212 44.8438 12.4594 44.2773 12.2252C43.7045 11.9876 42.8278 11.1782 42.1133 10.7046C41.3987 10.2305 41.1809 10.0579 40.8242 9.85895C41.4084 10.1943 43.0654 11.6597 43.0654 11.6597C43.0747 11.6675 44.4498 12.8239 44.7188 13.1373C44.9897 13.4505 45.0889 13.921 44.7969 14.3394C44.5042 14.7578 44.0389 14.8843 43.8115 14.8843C43.6697 14.8839 43.3178 14.5911 43.0635 14.4224L42.3809 13.8023L39.6172 11.4947L39.0625 11.0972L40.8262 12.6802L42.4297 14.1793C42.5184 14.3492 43.0945 14.8993 43.1631 15.0093C43.26 15.1662 42.7084 15.8782 42.2002 15.9722C41.7888 16.0484 40.6975 15.1911 40.2744 14.8785L39.373 14.0738C39.3874 14.0641 39.5986 13.91 39.6113 13.9009C39.9357 13.6667 39.9618 12.4995 39.4658 11.8423C38.9697 11.1857 37.8789 10.1314 37.8789 10.1314L36.125 8.73785C36.1246 8.73751 36.0012 8.63733 35.542 8.31793C36.3775 8.31761 37.1846 7.16656 37.1846 7.16656L35.7959 6.00934L34.543 4.0025L33.1338 3.65582L31.7305 2.70172H30.1436L28.793 2.68316C29.6817 1.35184 30.6066 0.852976 30.8369 0.762266ZM37.7295 13.9869C38.3305 14.2357 38.8521 14.2692 39.1982 14.1295C39.7299 14.6302 40.1639 15.0464 40.166 15.0738C40.1554 15.1574 40.1376 15.2797 40.1123 15.3843C40.0687 15.5623 39.5497 15.8452 39.377 15.8248C39.2047 15.8033 38.8983 15.7136 38.8945 15.7125L38.8164 15.5318C38.7947 15.2711 38.7888 15.1299 38.6211 14.9351C38.295 14.556 38.1702 14.3757 37.7295 13.9869Z" />
        <path d="M39.4424 12.8614C39.4424 13.2525 39.2791 13.614 39.1257 13.7249C38.8659 13.9125 38.4734 13.7647 37.8023 13.4867C37.4021 13.3213 36.835 12.8813 36.2867 12.4561C35.9311 12.1798 35.5627 11.8944 35.2254 11.6704C34.9227 11.4698 34.6918 11.3123 34.5061 11.1861C34.1552 10.9468 33.9437 10.8024 33.6563 10.6421C33.5582 10.5875 33.433 10.6199 33.376 10.7143C33.319 10.8086 33.3513 10.9297 33.4483 10.9854C34.1276 11.3754 36.0998 13.1166 36.1239 13.1376C36.1404 13.1519 37.7846 14.5349 38.0967 14.8976C38.3447 15.1847 38.4957 15.6537 38.1772 16.1102C37.8881 16.5246 37.4162 16.6769 37.1652 16.6792C37.0771 16.6605 36.8103 16.4683 36.6499 16.3529L35.5733 15.4286L32.2318 12.638L31.5507 12.1485C31.4631 12.0854 31.3397 12.1002 31.2698 12.1809C31.1999 12.2622 31.2081 12.3822 31.288 12.4543L33.4136 14.3621L35.3264 16.1517C35.4111 16.2881 35.6091 16.4996 35.8924 16.7975C35.9993 16.9094 36.1286 17.0447 36.1803 17.1073C36.1345 17.2977 35.6461 17.9094 35.1748 17.9964C34.8158 18.0629 33.5858 17.1402 33.1815 16.8372L33.0175 16.715C32.9258 16.6428 31.5818 15.4337 30.3901 14.3547C29.7742 13.7976 29.27 13.4492 29.2488 13.435C29.213 13.4099 29.1712 13.398 29.1295 13.398C29.0702 13.398 29.0114 13.4225 28.9709 13.4702C28.9021 13.5504 28.9097 13.6686 28.9873 13.7408C30.1844 14.8465 32.0866 16.6212 32.4122 16.9657C32.4005 17.0504 32.384 17.1488 32.364 17.2323C32.3147 17.3483 31.8434 17.6212 31.7006 17.616C31.5489 17.5973 31.08 17.4699 30.8819 17.4142L28.2339 15.905L27.5264 15.0369C27.517 15.0261 27.507 15.0159 27.4958 15.0068C27.4752 14.9909 25.4754 13.3952 24.7256 12.8074C24.0386 12.269 23.884 11.6716 23.8829 11.667L22.7516 10.2163V9.91784L21.3718 8.6638L20.1917 7.39725C20.1788 7.38304 20.1641 7.3711 20.1477 7.36144C20.0924 7.3279 18.7884 6.54455 18.1996 6.25349C17.7853 6.04884 17.7518 5.60032 17.75 5.49856C19.0323 1.06621 21.5534 0.0310296 21.5792 0.0207971C21.8266 -0.0764111 22.2591 0.193043 22.3908 0.295368L23.2253 0.33914H23.6366L26.894 2.20088L27.1967 2.4817L30.0857 3.1758L31.5959 3.18148L32.9147 4.07739L34.2457 4.41847L35.4158 6.29385L36.537 7.24149C36.3472 7.45694 35.9288 7.84918 35.4093 7.84918C34.8898 7.84918 33.785 7.06242 33.2003 6.64005C32.8853 6.41266 32.7295 6.30181 32.6302 6.26088C32.5415 6.22393 32.4381 6.25235 32.3822 6.32853C32.3258 6.4047 32.3323 6.50873 32.3975 6.57752C32.8265 7.034 34.0953 7.96515 34.1493 8.00437L35.471 8.81558L37.3239 10.3084C37.3909 10.3664 38.7566 11.5505 39.225 12.1695C39.3825 12.3787 39.4424 12.6255 39.4424 12.8614Z" />
    </svg>
);

const RifleIcon = ({ fill }: { fill: string }) => (
    <svg width="48" height="18" viewBox="0 0 63 18" fill={fill} xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M55.2011 2.49331V4.7585L55.9982 4.84231C56.0539 4.95425 56.1028 5.06675 56.145 5.17813C56.2007 5.26306 56.2361 5.34575 56.2502 5.43012C56.2502 5.49931 56.2148 5.56962 56.145 5.6405C56.0612 5.72375 55.9419 5.76594 55.7878 5.76594C55.7175 5.76594 55.641 5.74456 55.5572 5.7035H55.3052L54.9486 6.33238L54.2769 6.05956H48.6323L48.3392 6.41675L48.0028 6.16475H43.9742L43.9112 6.52194H37.5741L36.8192 6.92019C36.6375 7.03212 36.4553 7.12944 36.2736 7.21381C36.0778 7.2695 35.9451 7.29762 35.8748 7.29762C35.7347 7.29762 35.6019 7.27681 35.4765 7.23406C35.3921 7.22113 35.3359 7.18625 35.3089 7.12887L35.0147 6.941H32.1403C32.1403 7.65369 32.3012 8.38831 32.6229 9.14487C32.9025 9.80131 33.3435 10.5286 33.9448 11.3257C34.5608 12.1379 35.4416 12.9491 36.5886 13.7602C36.561 13.7602 36.435 13.9216 36.2117 14.2428C36.0294 14.5786 35.7983 14.9426 35.5193 15.3341C35.2673 15.7812 34.9523 16.2926 34.5748 16.8657C33.735 16.292 32.9379 15.6074 32.1819 14.8092C31.5249 14.1236 30.846 13.2629 30.1468 12.2285C29.4476 11.2205 28.8677 10.0179 28.4053 8.61894C28.3496 8.56325 28.2726 8.57056 28.1741 8.64031C28.1038 8.6825 28.0481 8.73144 28.0059 8.78713L27.3771 8.6825C27.0553 8.86419 26.7195 8.99019 26.3696 9.05994C26.0895 9.14488 25.7604 9.16456 25.3836 9.12294C24.9921 9.08075 24.6141 8.91256 24.2501 8.61894C24.222 8.61894 24.0898 8.72469 23.8513 8.93394C23.6139 9.14487 23.3552 9.41713 23.0756 9.75181C22.7826 10.1023 22.5092 10.4943 22.2572 10.9274C21.9911 11.3324 21.8089 11.7453 21.7116 12.1655C21.7116 12.1936 21.5856 12.2487 21.3341 12.3326C21.0968 12.4304 20.8161 12.494 20.4943 12.521C20.1872 12.5356 19.893 12.4659 19.614 12.3106C19.3474 12.1441 19.1803 11.8077 19.1094 11.3043C19.1235 11.2481 19.2287 11.0247 19.425 10.6332C19.5926 10.2693 19.7957 9.88513 20.0342 9.47844C20.2575 9.05881 20.4679 8.67406 20.6636 8.32475C20.8734 7.98894 20.9994 7.82075 21.0411 7.82075C20.9994 7.82075 20.8802 7.73806 20.685 7.56931C20.5168 7.40169 20.3346 7.33813 20.1383 7.38088C20.0972 7.39494 19.9571 7.44331 19.7192 7.52713C19.4672 7.59744 19.1528 7.70262 18.7748 7.84269C18.3962 7.98275 17.9777 8.13631 17.5159 8.30394C17.0394 8.47212 16.5647 8.63975 16.0883 8.80794C14.9694 9.2135 13.7173 9.67531 12.3324 10.1928L7.35994 11.8297L6.9375 5.8925C7.16138 5.72431 7.42012 5.59831 7.71375 5.5145C7.98038 5.41606 8.28806 5.33956 8.63738 5.28387C8.95969 5.21356 9.31631 5.22031 9.70781 5.30413C9.70781 5.33225 10.0155 5.32494 10.6303 5.28331C11.2463 5.213 11.9314 5.15731 12.6874 5.11569L15.7299 4.92669C15.9257 4.9835 16.1214 5.04538 16.3172 5.11569C16.6671 5.24113 16.9607 5.30413 17.1981 5.30413C17.2819 5.30413 17.4574 5.26306 17.7234 5.17813C18.0165 5.12188 18.3174 5.04537 18.6257 4.9475C18.975 4.86312 19.3665 4.745 19.8002 4.59144L21.7099 2.954L21.8775 3.12219H33.5443C33.5443 3.09462 33.5871 3.05975 33.6709 3.01812C33.7125 2.97537 33.7896 2.93994 33.9015 2.91237C34.0129 2.88481 34.1805 2.86963 34.4044 2.86963L43.3858 2.95344C43.5529 2.99562 43.7222 3.05187 43.8898 3.12162C44.0164 3.16381 44.1559 3.20544 44.3094 3.24762C44.4495 3.31794 44.5755 3.35956 44.6874 3.37362H48.4433C48.639 3.62563 48.8286 3.85625 49.0097 4.06662C49.1633 4.23425 49.332 4.40919 49.5131 4.59144C49.6667 4.745 49.8 4.82938 49.9114 4.84231H53.2059L53.4579 4.7585C53.6256 4.46544 53.7448 4.19938 53.8146 3.96144C53.9124 3.76513 54.0036 3.56262 54.0874 3.35281C54.1571 3.14187 54.2201 3.01025 54.2758 2.95344C54.318 2.75769 54.3388 2.65306 54.3388 2.63844V2.49219H55.2011V2.49331ZM26.5159 7.19356L25.3824 7.21438C25.1586 7.20031 24.9628 7.26219 24.7952 7.40281C24.6557 7.55694 24.5848 7.74594 24.5848 7.96981C24.5848 8.15094 24.6557 8.31237 24.7952 8.45187C24.9628 8.59194 25.1586 8.66281 25.3824 8.66281H26.5159C26.7257 8.66281 26.8933 8.59194 27.0199 8.45187C27.1459 8.31237 27.2078 8.15094 27.2078 7.96981C27.2078 7.74594 27.1453 7.55694 27.0199 7.40281C26.8933 7.26219 26.7257 7.19356 26.5159 7.19356Z" />
    </svg>
);

// For categories with very large SVGs, use weapon images from API as fallback
const FallbackIcon = ({ label, fill }: { label: string, fill: string }) => (
    <span style={{ fontSize: 9, fontWeight: 800, color: fill, letterSpacing: 1, textTransform: 'uppercase' as const }}>{label}</span>
);

const CATEGORIES = [
    { key: 'Knives', label: 'KNIFE' },
    { key: 'Gloves', label: 'GLOVE' },
    { key: 'Rifles', label: 'RIFLES' },
    { key: 'Sniper Rifles', label: 'SNIPERS' },
    { key: 'Pistols', label: 'PISTOLS' },
    { key: 'SMGs', label: 'SMG' },
    { key: 'Shotguns', label: 'SHOTGUNS' },
    { key: 'Machine Guns', label: 'NEGEV' },
];

export default function SkinClient({ initialUserSkins, user, customDbSkins }: { 
    initialUserSkins: UserSkin[], user: any, customDbSkins: any[] 
}) {
    const [weapons, setWeapons] = useState<Weapon[]>([]);
    const [allSkins, setAllSkins] = useState<Skin[]>([]);
    const [userSkins, setUserSkins] = useState<UserSkin[]>(initialUserSkins);
    
    const [selectedCat, setSelectedCat] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [loadingSelect, setLoadingSelect] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const [wRes, sRes] = await Promise.all([fetch('/api/csgo/weapons'), fetch('/api/csgo/skins')]);
                if (!wRes.ok || !sRes.ok) throw new Error("API Node Offline");
                const weaponsData = await wRes.json();
                const skinsData = await sRes.json();
                if (isMounted) {
                    setWeapons(weaponsData.filter((w: Weapon) => w.category && w.category.name && w.image));
                    setAllSkins(skinsData);
                    setFetchError(false);
                    setLoadingData(false);
                }
            } catch (err) {
                console.error("Uplink failed:", err);
                if (isMounted) { setFetchError(true); setTimeout(fetchData, 3000); }
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, []);

    const selectSkin = async (weaponType: string, skinId: string) => {
        setLoadingSelect(true);
        try {
            const res = await fetch('/api/skins/select', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ weapon_type: weaponType, skin_id: skinId })
            });
            if (res.ok) {
                const selectedCat = weapons.find(w => w.name === weaponType)?.category?.name;
                setUserSkins(prev => {
                    let next = prev.filter(s => s.weapon_type !== weaponType);
                    if (selectedCat === 'Knives' || selectedCat === 'Gloves') {
                        next = next.filter(s => {
                            const cat = weapons.find(w => w.name === s.weapon_type)?.category?.name;
                            return cat !== selectedCat;
                        });
                    }
                    return [...next, { weapon_type: weaponType, skin_id: skinId }];
                });
                setSelectedWeapon(null);
            }
        } finally { setLoadingSelect(false); }
    };

    if (loadingData) {
        return (
            <div style={{ display:'flex', flexDirection:'column', height:'100vh', width:'100%', alignItems:'center', justifyContent:'center', background:'#111' }}>
                <div style={{ width:48, height:48, border:'3px solid', borderColor: fetchError ? '#f43f5e' : '#3b82f6', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite' }}></div>
                <div style={{ marginTop:16, color: fetchError ? '#f43f5e' : '#6b7280', fontSize:12, letterSpacing:2 }}>
                    {fetchError ? 'Connection failed. Retrying...' : 'Loading...'}
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const customSkinsFormatted: Skin[] = customDbSkins.map(s => ({
        id: s.id, name: `${s.weapon_type} | ${s.name}`, image: '/relic.png', paint_index: s.id,
        weapon: { name: s.weapon_type }, rarity: { name: 'WORKSHOP', color: '#EAB308' }, isCustom: true
    }));

    const displayedWeapons = selectedCat !== 'All'
        ? weapons.filter(w => w.category?.name === selectedCat)
        : weapons;

    let globalSkinsSearch: Skin[] = [];
    if (searchQuery && !selectedWeapon) {
        globalSkinsSearch = [...customSkinsFormatted.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())),
            ...allSkins.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))];
    }

    let weaponSkinsToDisplay: Skin[] = [];
    if (selectedWeapon) {
        weaponSkinsToDisplay = [...customSkinsFormatted.filter(s => s.weapon.name === selectedWeapon.name),
            ...allSkins.filter(s => s.weapon?.name === selectedWeapon.name || s.name.includes(selectedWeapon.name))];
    }

    // Get icon for category - use SVG component if available, else use weapon image
    const getCatIcon = (catKey: string, isActive: boolean) => {
        const fill = isActive ? '#ffffff' : '#717981';
        switch (catKey) {
            case 'Knives': return <KnifeIcon fill={fill} />;
            case 'Gloves': return <GloveIcon fill={fill} />;
            case 'Rifles': return <RifleIcon fill={fill} />;
            default: {
                const w = weapons.find(wp => wp.category?.name === catKey);
                if (w) return <img src={w.image} alt="" style={{ maxHeight:22, maxWidth:42, objectFit:'contain', filter: isActive ? 'brightness(0) invert(1)' : 'grayscale(1) brightness(0.5)', transition:'filter 0.15s' }} />;
                return <FallbackIcon label={catKey.substring(0,3)} fill={fill} />;
            }
        }
    };

    return (
        <div style={{ minHeight:'100vh', background:'#1a1a2e', color:'#c4c4c4', fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
            {/* Top Category Bar */}
            <div style={{ display:'flex', alignItems:'center', gap:0, background:'#16163a', borderBottom:'1px solid #2a2a4a', padding:'0 12px', height:52, overflowX:'auto' }}>
                {/* Show All Grid Icon */}
                <button
                    onClick={() => { setSelectedCat('All'); setSelectedWeapon(null); setSearchQuery(''); }}
                    style={{
                        display:'flex', alignItems:'center', justifyContent:'center',
                        width:40, height:40, borderRadius:6, border:'none', cursor:'pointer', marginRight:4, flexShrink:0,
                        background: selectedCat === 'All' ? '#2563eb' : 'transparent', transition:'background 0.15s'
                    }}
                    title="Show all"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={selectedCat === 'All' ? '#fff' : '#717981'}>
                        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
                        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
                    </svg>
                </button>

                {/* Category icon tabs */}
                {CATEGORIES.map(cat => {
                    const isActive = selectedCat === cat.key;
                    return (
                        <button
                            key={cat.key}
                            onClick={() => { setSelectedCat(cat.key); setSelectedWeapon(null); setSearchQuery(''); }}
                            title={cat.label}
                            style={{
                                display:'flex', alignItems:'center', justifyContent:'center',
                                width:52, height:40, borderRadius:6, border:'none', cursor:'pointer', marginRight:2, flexShrink:0,
                                background: isActive ? '#2563eb' : 'transparent', transition:'background 0.15s', padding:4
                            }}
                        >
                            {getCatIcon(cat.key, isActive)}
                        </button>
                    );
                })}

                {/* Spacer */}
                <div style={{ flex:1 }}></div>

                {/* Search */}
                <div style={{ position:'relative', width:220, flexShrink:0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#717981" strokeWidth="2" style={{ position:'absolute', left:10, top:10 }}>
                        <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={(e: any) => setSearchQuery(e.target.value)}
                        style={{
                            width:'100%', background:'#111130', border:'1px solid #2a2a4a', borderRadius:6,
                            padding:'8px 12px 8px 32px', fontSize:13, color:'#fff', outline:'none'
                        }}
                    />
                </div>

                {/* User / Login */}
                <div style={{ marginLeft:12, flexShrink:0 }}>
                    {user ? (
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            {user.avatar ? <img src={user.avatar} style={{ width:28, height:28, borderRadius:'50%' }} alt="" /> : <div style={{ width:28, height:28, borderRadius:'50%', background:'#333' }}/>}
                            <span style={{ color:'#ccc', fontSize:12, fontWeight:600 }}>{user.username}</span>
                            <a href="/api/auth/logout" style={{ color:'#f43f5e', fontSize:11, fontWeight:700, marginLeft:8, textDecoration:'none' }}>Logout</a>
                        </div>
                    ) : (
                        <a href="/api/auth/steam/login" style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 16px', background:'#2563eb', borderRadius:6, color:'#fff', fontSize:12, fontWeight:700, textDecoration:'none' }}>
                            Sign in
                        </a>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div style={{ padding:'20px 24px', maxWidth:1400, margin:'0 auto' }}>
                {/* Search Results OR Main weapon grid */}
                {searchQuery ? (
                    <div>
                        <div style={{ fontSize:13, color:'#717981', marginBottom:16 }}>
                            Results for <span style={{ color:'#fff' }}>"{searchQuery}"</span>
                        </div>
                        {globalSkinsSearch.length === 0 ? (
                            <div style={{ color:'#555', fontSize:14, marginTop:40 }}>No skins found.</div>
                        ) : (
                            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:12 }}>
                                {globalSkinsSearch.slice(0, 60).map(skin => {
                                    const weaponName = skin.weapon?.name || "";
                                    const isEquipped = userSkins.find(s => s.weapon_type === weaponName)?.skin_id === (skin.paint_index || skin.id);
                                    return (
                                        <div
                                            key={skin.id}
                                            onClick={() => {
                                                if(!loadingSelect && weaponName) {
                                                    selectSkin(weaponName, skin.paint_index || skin.id);
                                                }
                                            }}
                                            style={{
                                                background: isEquipped ? '#1e1e5a' : '#111130', borderRadius:8, cursor:'pointer', overflow:'hidden',
                                                border: isEquipped ? '2px solid #3b82f6' : '1px solid #222244', transition:'border-color 0.15s',
                                                opacity: loadingSelect ? 0.5 : 1
                                            }}
                                        >
                                            <div style={{ height:100, display:'flex', alignItems:'center', justifyContent:'center', padding:12 }}>
                                                <img src={skin.image} style={{ maxHeight:'100%', maxWidth:'100%', objectFit:'contain' }} alt="" />
                                            </div>
                                            <div style={{ padding:'6px 10px 10px', borderTop:'1px solid #222244' }}>
                                                <div style={{ fontSize:10, color:'#717981', fontWeight:600 }}>{weaponName}</div>
                                                <div style={{ fontSize:12, color: isEquipped ? '#60a5fa' : '#ddd', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                                                    {skin.name.replace(`${weaponName} | `, '')}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Main weapon grid */
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(130px, 1fr))', gap:10 }}>
                        {displayedWeapons.map(w => {
                            const equippedId = userSkins.find(s => s.weapon_type === w.name)?.skin_id;
                            const equippedSkin = equippedId
                                ? allSkins.find(s => (s.id === equippedId || s.paint_index === equippedId) && s.weapon?.name === w.name) || customSkinsFormatted.find(s => s.id === equippedId)
                                : null;
                            return (
                                <div key={w.id} onClick={() => setSelectedWeapon(w)}
                                    style={{ background: equippedSkin ? '#111140' : '#111130', borderRadius:8, cursor:'pointer', padding:12, textAlign:'center',
                                        border: equippedSkin ? '1px solid #2a2a6a' : '1px solid #1a1a3a', transition:'border-color 0.15s, background 0.15s' }}>
                                    <div style={{ height:70, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:8 }}>
                                        <img src={equippedSkin ? equippedSkin.image : w.image} alt={w.name}
                                            style={{ maxHeight:'100%', maxWidth:'100%', objectFit:'contain',
                                                filter: equippedSkin ? 'none' : 'grayscale(1) brightness(0.3)', transition:'filter 0.2s' }} />
                                    </div>
                                    {equippedSkin && (
                                        <div style={{ fontSize:10, color:'#60a5fa', fontWeight:700, marginBottom:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                                            {equippedSkin.name.replace(`${w.name} | `, '')}
                                        </div>
                                    )}
                                    <div style={{ fontSize:11, color: equippedSkin ? '#ccc' : '#555', fontWeight:600 }}>{w.name}</div>
                                </div>
                            );
                        })}

                        {selectedCat !== 'All' && (
                            <div onClick={() => { setSelectedCat('All'); setSelectedWeapon(null); }}
                                style={{ background:'#111130', borderRadius:8, cursor:'pointer', padding:12, textAlign:'center',
                                    border:'1px solid #1a1a3a', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                                <div style={{ height:70, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#717981">
                                        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
                                        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
                                    </svg>
                                </div>
                                <div style={{ fontSize:11, color:'#3b82f6', fontWeight:600 }}>Show all</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Skin Selection Modal Overlay */}
                {selectedWeapon && (
                    <div 
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                            background: 'rgba(0,0,0,0.85)', zIndex: 100, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: 24, backdropFilter: 'blur(4px)'
                        }} 
                        onClick={() => setSelectedWeapon(null)}
                    >
                        <div 
                            style={{
                                background: '#1a1a2e', width: '100%', maxWidth: 1100, maxHeight: '90vh',
                                borderRadius: 12, border: '1px solid #2a2a4a', 
                                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                            }} 
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid #2a2a4a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#16163a' }}>
                                <div>
                                    <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>{selectedWeapon.name}</div>
                                    <div style={{ fontSize:13, color:'#717981', marginTop: 4 }}>Select a skin to equip</div>
                                </div>
                                <button onClick={() => setSelectedWeapon(null)} style={{ background:'none', border:'none', color:'#717981', fontSize:28, cursor:'pointer', padding: '0 8px', lineHeight: 1 }}>
                                    &times;
                                </button>
                            </div>
                            
                            {/* Modal Body / Scrollable Area */}
                            <div style={{ padding: 24, overflowY: 'auto' }}>
                                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:14 }}>
                                    {weaponSkinsToDisplay.map(skin => {
                                        const wname = selectedWeapon.name;
                                        const isEquipped = userSkins.find(s => s.weapon_type === wname)?.skin_id === (skin.paint_index || skin.id);
                                        const rarityColor = skin.rarity?.color || '#b0c3d9';
                                        return (
                                            <div key={skin.id} onClick={() => !loadingSelect && selectSkin(wname, skin.paint_index || skin.id)}
                                                style={{ background: isEquipped ? '#1e1e5a' : '#111130', borderRadius:8, cursor:'pointer', overflow:'hidden', position:'relative',
                                                    border: isEquipped ? '2px solid #3b82f6' : '1px solid #222244', transition:'border-color 0.15s', opacity: loadingSelect ? 0.5 : 1 }}>
                                                <div style={{ height:3, width:'100%', background: rarityColor }}></div>
                                                {skin.isCustom && <div style={{ position:'absolute', top:6, left:6, background:'#EAB308', color:'#000', fontSize:9, fontWeight:800, padding:'2px 6px', borderRadius:3, zIndex:2 }}>WORKSHOP</div>}
                                                <div style={{ height:110, display:'flex', alignItems:'center', justifyContent:'center', padding:12 }}>
                                                    <img src={skin.image} style={{ maxHeight:'100%', maxWidth:'100%', objectFit:'contain' }} alt="" />
                                                </div>
                                                <div style={{ padding:'8px 12px 12px', borderTop:'1px solid #222244' }}>
                                                    <div style={{ fontSize:10, color: rarityColor, fontWeight:700, textTransform:'uppercase' as const }}>{skin.rarity?.name || 'Standard'}</div>
                                                    <div style={{ fontSize:13, color: isEquipped ? '#60a5fa' : '#ddd', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', marginTop: 2 }}>
                                                        {skin.name.replace(`${wname} | `, '')}
                                                    </div>
                                                    {isEquipped && <div style={{ fontSize:10, color:'#3b82f6', fontWeight:700, marginTop:6 }}>EQUIPPED</div>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
